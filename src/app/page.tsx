"use client"
import * as React from 'react';

import DenseAppBar from '~/app/components/appbar';
import BasicList from '~/app/components/sidebar';
import { Card, Box, Grid, Typography, Divider } from '@mui/material';

import {
  APPBAR_HEIGHT,
  STATIC_COMPONENT_SIZE,
  getWindowDimensions
} from "~/app/components/common";

export default function Home() {
  const [ws_directory, set_ws_directory] = React.useState("~/integ_ws/autoware");
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

  return (
    <>
      <DenseAppBar appbar_height={APPBAR_HEIGHT} ws_directory={ws_directory} />
      <Box sx={{ display: "flex", width: "100%", height: `${window_size.height - APPBAR_HEIGHT}px` }} >
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={2}>
            <BasicList static_component_size={STATIC_COMPONENT_SIZE} window_size={window_size} />
          </Grid>
          <Grid item xs={10} sx={{ height: "100%" }}>
            <Card sx={{ height: "100%" }}>
              このページでは初期設定として、適合させる機体に対して必要な設定を提案・誘導する
              <Typography variant='h4'>初期設定</Typography>
              <Divider></Divider>
              <li> vehicle_model:  </li>
              <li> sensor_model: </li>
              <li> vehicle_id: </li>

              <Divider></Divider>

              <li> launch script: ros2 launch autoware.launch vehicle_model:="~~~~~~"</li>

            </Card>
          </Grid>
        </Grid>
      </Box >
    </>
  );
}