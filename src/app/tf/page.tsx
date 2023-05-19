"use client"
import { Box, Grid, TextField } from '@mui/material';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as React from 'react';
import { Ground, Vehicle } from '../components/vehicle_model_view';
import axios from 'axios';
import Link from 'next/link';
import { Mermaid } from 'mdx-mermaid/Mermaid';

export default function TF() {
  const [vehicle_data, set_vehicle_data] = React.useState({});
  const [sensors_calib, set_sensors_calib] = React.useState({});
  const [sensor_kit_calib, set_sensor_kit_calib] = React.useState({});

  const get_vehicle_param = async () => {
    const response = await axios.get('/api/vehicle_model', {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    });
    set_vehicle_data(response.data.data["/**"]["ros__parameters"]);
  }

  const get_calib_param = async () => {
    const response = await axios.get('/api/sensor_kit', {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    });
    set_sensor_kit_calib(response.data.sensor_kit_calib);
    set_sensors_calib(response.data.sensors_calib);
  }

  React.useEffect(() => {
    get_vehicle_param();
    get_calib_param();
  }, [])

  return (<>
    <Grid container>
      <Grid item xs={4}>
        <Box sx={{ height: "500px" }}>
          {Object.keys(vehicle_data).length > 0 &&
            <Canvas>
              <axesHelper args={[3]} />
              <gridHelper args={[5, 100]} />
              <OrbitControls />
              <ambientLight intensity={0.1} />
              <Vehicle vehicle_data={vehicle_data} />
              <Ground vehicle_data={vehicle_data} />
            </Canvas>
          }
        </Box>
      </Grid>

      <Grid item xs={8}>
        <Box sx={{ height: "250px" }}>
          {Object.keys(vehicle_data).length > 0 &&
            <Canvas>
              <axesHelper args={[3]} />
              <gridHelper args={[5, 100]} />
              <OrbitControls />
              <ambientLight intensity={0.1} />
              <Vehicle vehicle_data={vehicle_data} />
              <Ground vehicle_data={vehicle_data} />
            </Canvas>
          }
        </Box>

        <Box sx={{ height: "250px" }}>
          {Object.keys(vehicle_data).length > 0 &&
            <Canvas>
              <axesHelper args={[3]} />
              <gridHelper args={[5, 100]} />
              <OrbitControls />
              <ambientLight intensity={0.1} />
              <Vehicle vehicle_data={vehicle_data} />
              <Ground vehicle_data={vehicle_data} />
            </Canvas>
          }
        </Box>
      </Grid>
      <Grid>
        <Box display="flex">

          <Box sx={{ width: 400 }}>
            sensors_calib
            {/* <TextField fullWidth multiline value={JSON.stringify(sensors_calib.data, null, "\t")} /> */}
            <TextField fullWidth multiline value={sensors_calib.raw} />
          </Box>
          <Box sx={{ width: 400 }}>
            sensor_kit_calib
            {/* <TextField fullWidth multiline value={JSON.stringify(sensor_kit_calib.data, null, "\t")} /> */}
            <TextField fullWidth multiline value={sensor_kit_calib.raw} />
          </Box>
          <Box>
            <Box>

              <Mermaid chart={`graph TD;
base_link-->sensor_kit_base_link;
sensor_kit_base_link-->velodyne_right_base_link;
velodyne_right_base_link-->velodyne_right;
sensor_kit_base_link-->velodyne_left_base_link;
velodyne_left_base_link-->velodyne_left;
`} />


            </Box>
            <Box>
              <Link href={"https://mermaid.js.org/syntax/stateDiagram.html"} >
                mermaid.js
              </Link>
            </Box>
            <Box>
              <Link href={"https://sjwall.github.io/mdx-mermaid/docs/examples/"} >
                sjwall
              </Link>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid >
  </>);
}