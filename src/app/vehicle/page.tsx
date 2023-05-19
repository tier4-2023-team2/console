"use client"
import * as React from 'react';
import axios from "axios";

import { Card, Box, Grid, Typography, Divider, TextField, Button } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Canvas } from '@react-three/fiber'
import { DoubleSide } from 'three';
import { OrbitControls } from '@react-three/drei'
import VehicleModelView from '../components/vehicle_model_view';


export default function Vehicle() {

  const [vehicle_data, set_vehicle_data] = React.useState({});
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
  React.useEffect(() => {
    console.log(vehicle_data)
  }, [vehicle_data])

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
      <Card sx={{ height: "100%" }}>
        <Typography variant='h4'>Vehicle</Typography>
        <Divider sx={{ pb: 1 }}></Divider>
        <Typography variant='h7'>FilePath: {vehicle_data_path}</Typography>
        <Divider sx={{ pb: 1 }}></Divider>
        <Button onClick={update_data}>update</Button>
        <Grid container>
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
            <VehicleModelView vehicle_data={vehicle_data} />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}