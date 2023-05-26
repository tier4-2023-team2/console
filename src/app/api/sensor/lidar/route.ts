import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const fs = require('fs');
var convert = require('xml-js');
const lineByLine = require('n-readlines');

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        
        const launch_xml_path = `${process.env.workspace}/src/sensor_kit/${process.env.sensor_model}_launch/${process.env.sensor_model}_launch/launch/lidar.launch.xml`
        const xml = fs.readFileSync(launch_xml_path, "utf8");
        var json = convert.xml2json(xml, { compact: true, spaces: 0 });

        const pointcloud_preprocessor_path = `${process.env.workspace}/src/sensor_kit/${process.env.sensor_model}_launch/${process.env.sensor_model}_launch/launch/pointcloud_preprocessor.launch.py`

        const liner = new lineByLine(pointcloud_preprocessor_path);
        let line;
        let state = 0;
        let preprocessor_src = "";
        let start_line_idx = 0;
        let idx = 0;
        while (line = liner.next()) {
            idx++;
            const tmp_str = line.toString('ascii');
            switch (state) {
                case 0:
                    if (!!tmp_str.match(/concat_component/)) {
                        state = 1;
                        start_line_idx = idx;
                        preprocessor_src += `${line}\n`;
                    }
                    break;
                case 1:
                    preprocessor_src += `${line}\n`;
                    if (!!tmp_str.match(/extra_arguments/)) {
                        state = 2;
                    }
                    break;

            }
            if (state === 2) {
                liner.close();
                break;
            }
        }

        const localization_launch_path = `${process.env.workspace}/src/universe/autoware.universe/launch/tier4_localization_launch/launch/localization.launch.xml`

        const liner_l = new lineByLine(localization_launch_path);
        state = 1;
        let licalization = "";
        let localization_start_line_idx = 1;
        idx = 0;

        while (line = liner_l.next()) {
            idx++;
            const tmp_str = line.toString('ascii');
            switch (state) {
                // case 0:
                //     if (!!tmp_str.match(/concat_component/)) {
                //         state = 1;
                //         localization_start_line_idx = idx;
                //         licalization += `${line}\n`;
                //     }
                //     break;
                case 1:
                    licalization += `${line}\n`;
                    if (!!tmp_str.match(/localization module/)) {
                        state = 2;
                    }
                    break;

            }
            if (state === 2) {
                liner_l.close();
                break;
            }
        }

        return NextResponse.json({
            launch_json: JSON.parse(json),
            preprocessor_src: preprocessor_src,
            preprocessor_src_start_idx: start_line_idx,
            localization_src: licalization,
            localization_src_start_idx: localization_start_line_idx
        });
    } catch (e) {
        return NextResponse.json({
            status: "load fail"
        })
    }
}
