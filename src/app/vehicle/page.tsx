"use client"
import * as React from 'react';
import axios from "axios";

import DenseAppBar from '~/app/components/appbar';
import BasicList from '~/app/components/sidebar';
import { Card, Box, Grid, Typography, Divider, TextField, Button } from '@mui/material';
import {
  APPBAR_HEIGHT,
  STATIC_COMPONENT_SIZE,
  getWindowDimensions
} from "~/app/components/common";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Build() {
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

  const [vehicle_data, set_vehicle_data] = React.useState("");
  const [vehicle_data_path, set_vehicle_data_path] = React.useState("");

  const get_vehicle_param = async () => {
    const response = await axios.get('/api/vehicle_model', {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    });
    set_vehicle_data(response.data.data["/**"]["ros__parameters"]);
    set_vehicle_data_path(response.data.path);
  }

  React.useEffect(() => {
    get_vehicle_param();
  }, [])

  const update_data = async () => {
    const response = await axios.post('/api/vehicle_model', {
      ["/**"]: {
        ["ros__parameters"]: vehicle_data
      }
    }, {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    });
  }

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
              <Typography variant='h4'>Vehicle</Typography>
              <Divider sx={{ pb: 1 }}></Divider>
              <Typography variant='h7'>FilePath: {vehicle_data_path}</Typography>
              <Divider sx={{ pb: 1 }}></Divider>
              <Button onClick={update_data}>update</Button>
              <Grid container>
                {/* <Grid item xs={5}>
                  <TextField
                    id="outlined-multiline-static"
                    label={vehicle_data_path}
                    multiline
                    defaultValue="Default Value"
                    sx={{ minWidth: 300, height: 500 }}
                    value={JSON.stringify(vehicle_data, null, "\t")}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid> */}
                <Grid item xs={6}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Param</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.keys(vehicle_data).map((ele, idx) => {
                          return (
                            <TableRow key={`key_${idx}`} sx={{ m: 0, p: 0 }}>
                              <TableCell sx={{ m: 0, p: 0 }}>{ele}</TableCell>
                              <TableCell sx={{ m: 0, p: 0 }}>
                                <TextField margin="dense"
                                  sx={{ m: 0, p: 0 }}
                                  value={vehicle_data[ele]}
                                  onChange={(e) => {
                                    set_vehicle_data({
                                      ...vehicle_data,
                                      [ele]: parseFloat(e.target.value)
                                    })
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={6}>
                  Three.jsで図を作って描画する
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid >
      </Box >
    </>
  );
}