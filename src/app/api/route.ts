import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

import { json } from 'body-parser';

const yaml = require('js-yaml');
const fs = require('fs');

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const req_json = await req.json();
    try {
        const txt = fs.readFileSync(`${process.env.workspace}/src/vehicle/${process.env.vehicle_model}_launch/${process.env.vehicle_model}_description/config/vehicle_info.param.yaml`, "utf8");
        return NextResponse.json({
            file_name: "vehcile",
            path: "",
            data: yaml.load(txt),
            body: req_json
        });
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            status: "load fail"
        })
    }
}