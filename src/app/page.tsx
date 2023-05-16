"use client"
import * as React from 'react';
import { Card, Box,  Typography, Divider, Button, TextField } from '@mui/material';

import axios from 'axios';
import { DEFAULT_SYSTEM_CONF } from './components/common';

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

  return (
    <>
      <Card sx={{ height: "100%" }}>
        このページでは初期設定として、適合させる機体に対して必要な設定を提案・誘導する
        <Typography variant='h4'>設定状況</Typography>
        <Divider></Divider>
        <li> workspace:
          <TextField value={system_config.workspace} onChange={(evt) => {
            set_system_config({
              ...system_config,
              workspace: evt.target.value
            })
          }} />
        </li>
        <li> vehicle_model:  <TextField value={system_config.vehicle_model} onChange={(evt) => {
          set_system_config({
            ...system_config,
            vehicle_model: evt.target.value
          })
        }} /> </li>
        <li> sensor_model: <TextField value={system_config.sensor_model} onChange={(evt) => {
          set_system_config({
            ...system_config,
            sensor_model: evt.target.value
          })
        }} /> </li>


        <li> launch_prefix: <TextField multiline value={system_config.launch_prefix} onChange={(evt) => {
          set_system_config({
            ...system_config,
            launch_prefix: evt.target.value
          })
        }} /> </li>

        <li> launch_suffix: <TextField multiline value={system_config.launch_suffix} onChange={(evt) => {
          set_system_config({
            ...system_config,
            launch_suffix: evt.target.value
          })
        }} /> </li>

        <li> vehicle_id: </li>
        <Button onClick={update_system_data}> updata </Button>

        <Divider></Divider>
        <div>起動スクリプト</div>
        <Box sx={{ color: "red" }}> {launch_script} </Box>
        <Button onClick={copy}>copy</Button>
      </Card>
    </>
  );
}