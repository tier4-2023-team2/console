import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const fs = require('fs');
const lineByLine = require('n-readlines');
const regexp = new RegExp(/warning|WARNING|error|ERROR/g);
const regexp_prefix = new RegExp(/^\[\d.*\]\s\(.*\)/);

const regexp_cmd = new RegExp("/usr/bin/cmake");

const regexp_is_release = new RegExp("-DCMAKE_BUILD_TYPE=Release");
const regexp_is_symlink_install = new RegExp("-DAMENT_CMAKE_SYMLINK_INSTALL=1");
const regexp_build_cmd = new RegExp("--build");
const regexp_install_cmd = new RegExp("--install");


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const path = `${process.env.workspace}/log/latest/events.log`
        const liner = new lineByLine(path);
        let line;
        let lineNumber = 0;
        let warn = {};
        let no_release_build = []
        let no_symlink_install = [];
        while (line = liner.next()) {
            let tmp_str = line.toString('ascii');
            if (!!tmp_str.match(regexp_cmd) && !tmp_str.match(regexp_build_cmd) && !tmp_str.match(regexp_install_cmd)) {
                const tmp_lines = tmp_str.split(" ");
                const name = tmp_lines[1].slice(1, -1);
                if (!tmp_str.match(regexp_is_release)) {
                    no_release_build.push(name);
                }
                if (!tmp_str.match(regexp_is_symlink_install)) {
                    no_symlink_install.push(name);
                }
            }

            if (!!tmp_str.match(regexp)) {
                const tmp_lines = tmp_str.split(" ");
                if (!!`${tmp_lines[0]} ${tmp_lines[1]}`.match(regexp_prefix)) {
                    const name = tmp_lines[1].slice(1, -1);
                    if (warn[name] === undefined) {
                        warn[name] = [];
                    }
                    warn[name].push(tmp_str);
                    lineNumber++;
                }
            }
        }

        const stats = fs.statSync(path);
        return NextResponse.json({
            file_name: "events.log",
            build_date: stats.mtimeMs,
            warn_size: lineNumber,
            warn_list: warn,
            no_release_package: no_release_build,
            no_symlink_install_package: no_symlink_install
        });
    } catch (e) {
        return NextResponse.json({
            status: "load fail"
        })
    }
}
