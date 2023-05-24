import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
const { spawn } = require('child_process');
// gnome-terminal に与える引数。下記の例では新しいターミナルで 'ls -l' コマンドを実行します


export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {

    return NextResponse.json({
      config_list:
        ["launch_vehicle", "launch_system", "launch_map", "launch_sensing", "launch_sensing_driver", "launch_perception", "launch_planning", "launch_control", "use_sim_time", "launch_vehicle_interface"]
    })
  } catch (e) {
    return NextResponse.json({
      status: "load fail"
    })
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const terminal = '/usr/bin/gnome-terminal';

    const base_suffix = `vehicle_model:=${process.env.vehicle_model} sensor_model:=${process.env.sensor_model} ${process.env.launch_suffix}`;
    const launch = "planning_simulator.launch.xml";
    const req_suffix = await req.json();
    console.log(req_suffix)
    const parameters = ['--', '/bin/bash', '-c',
      `cd ${process.env.workspace} && source ./install/setup.bash && echo ${req_suffix.suffix} && ros2 launch autoware_launch ${launch} ${base_suffix}; ${req_suffix.suffix}; exec bash `];
    // `cd ${process.env.workspace} &&  source ./install/setup.bash && ros2 launch autoware_launch planning_simulator.launch.xml ${suffix}; exec bash`];

    const terminalProcess = spawn(terminal, parameters);
    terminalProcess.on('error', (err) => {
      console.error('Failed to start subprocess.');
    });
    terminalProcess.on('exit', (code, signal) => {
      if (code) console.log('Process exit with code ', code);
      if (signal) console.log('Process killed with signal ', signal);
    });
    return NextResponse.json({
      status: "launch"
    })
  } catch (e) {
    return NextResponse.json({
      status: "load fail"
    })
  }
}
