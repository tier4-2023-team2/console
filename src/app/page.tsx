"use client"
import * as React from 'react';

import DenseAppBar from '~/app/components/appbar';
import BasicList from '~/app/components/sidebar';
import { Card, Box, Grid, Typography, Divider, Button, TextField } from '@mui/material';

import {
  APPBAR_HEIGHT,
  STATIC_COMPONENT_SIZE,
  getWindowDimensions
} from "~/app/components/common";
import axios from 'axios';

const DEFAULT_SYSTEM_CONF = {
  workspace: "",
  vehicle_model: "",
  sensor_model: "",
  launch_prefix: "",
  launch_suffix: "",
}

export default function Home() {
  const [system_config, set_system_config] = React.useState(DEFAULT_SYSTEM_CONF);
  const [launch_script, set_launch_script] = React.useState("");
  const [window_size, set_window_size] = React.useState({
    width: 500,
    height: 900
  });
  React.useEffect(() => {
    set_window_size(getWindowDimensions());
    const onResize = (evt: Event) => {
      set_window_size(getWindowDimensions());
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
      <DenseAppBar appbar_height={APPBAR_HEIGHT} ws_directory={system_config.workspace} />
      <Box sx={{ display: "flex", width: "100%", height: `${window_size.height - APPBAR_HEIGHT}px` }} >
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={2}>
            <BasicList static_component_size={STATIC_COMPONENT_SIZE} window_size={window_size} />
          </Grid>
          <Grid item xs={10} sx={{ height: "100%" }}>
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
          </Grid>
        </Grid>
      </Box >
    </>
  );
}