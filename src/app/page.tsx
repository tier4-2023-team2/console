"use client"
import * as React from 'react';
import { Card, Box, Typography, Divider, Button, TextField } from '@mui/material';

import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DEFAULT_SYSTEM_CONF } from './components/common';
import { red } from '@mui/material/colors';

export default function Home() {
  const [system_config, set_system_config] = React.useState(DEFAULT_SYSTEM_CONF);
  const [launch_script, set_launch_script] = React.useState("");

  const get_system_data = async () => {
    const response = await axios.get('/api/system', {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    });
    set_system_config(response.data);
  };
  const update_system_data = async () => {
    const response = await axios.post('/api/system', {
      system_config
    });
  }

  const copy = async () => {
    await global.navigator.clipboard.writeText(launch_script);
  }
  React.useEffect(() => {
    get_system_data();
  }, []);

  React.useEffect(() => {
    set_launch_script(`${system_config.launch_prefix.replaceAll("\n", " ")} ros2 launch autoware.launch vehicle_model:=${system_config.vehicle_model} sensor_model:= ${system_config.sensor_model} ${system_config.launch_suffix.replaceAll("\n", " ")}`);
  }, [system_config])

  const text_field_width = 500;

  return (
    <>
      <Card sx={{ height: "100%" }}>
        このページでは初期設定として、適合させる機体に対して必要な設定を提案・誘導する
        <Typography variant='h4'>設定状況</Typography>
        <Divider></Divider>

        <Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow >
                  <TableCell>workspace</TableCell>
                  <TableCell>
                    <TextField sx={{ width: text_field_width }} value={system_config.workspace} onChange={(evt) => {
                      set_system_config({
                        ...system_config,
                        workspace: evt.target.value
                      })
                    }} />
                  </TableCell>
                </TableRow>


                <TableRow >
                  <TableCell>vehicle_model</TableCell>
                  <TableCell>
                    <TextField sx={{ width: text_field_width }} value={system_config.vehicle_model} onChange={(evt) => {
                      set_system_config({
                        ...system_config,
                        vehicle_model: evt.target.value
                      })
                    }} />
                  </TableCell>
                </TableRow>


                <TableRow >
                  <TableCell>sensor_model</TableCell>
                  <TableCell>
                    <TextField sx={{ width: text_field_width }} value={system_config.sensor_model} onChange={(evt) => {
                      set_system_config({
                        ...system_config,
                        sensor_model: evt.target.value
                      })
                    }} />
                  </TableCell>
                </TableRow>


                <TableRow >
                  <TableCell>launch_prefix</TableCell>
                  <TableCell>
                    <TextField sx={{ width: text_field_width }} multiline value={system_config.launch_prefix} onChange={(evt) => {
                      set_system_config({
                        ...system_config,
                        launch_prefix: evt.target.value
                      })
                    }} />
                  </TableCell>
                </TableRow>



                <TableRow >
                  <TableCell>launch_suffix</TableCell>
                  <TableCell>
                    <TextField sx={{ width: text_field_width }} multiline value={system_config.launch_suffix} onChange={(evt) => {
                      set_system_config({
                        ...system_config,
                        launch_suffix: evt.target.value
                      })
                    }} />
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* <li> vehicle_id: </li> */}
        <Button onClick={update_system_data}> update </Button>

        <Divider></Divider>
        <div>起動スクリプト</div>
        <Box sx={{ color: red[800] }}>
          <Typography variant='h6'>
            {launch_script}
          </Typography>
        </Box>
        <Button onClick={copy}>copy</Button>
        <Box>
          <TextField multiline sx={{ width: 800 }}></TextField>
        </Box>
      </Card>
    </>
  );
}