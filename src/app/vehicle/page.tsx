"use client"
import * as React from 'react';
import axios, { AxiosHeaders } from "axios";

import DenseAppBar from '~/app/components/appbar';
import BasicList from '~/app/components/sidebar';
import { Card, Box, Grid, Typography, Divider, TextField, Button } from '@mui/material';
import {
  getWindowDimensions
} from "~/app/components/common";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { BoxGeometry, CylinderGeometry, DoubleSide, Vector3, } from 'three';
import { useGLTF, MeshReflectorMaterial, Environment, Stage, PresentationControls, OrbitControls } from '@react-three/drei'

//  {/* 本来 */}
//   {/* position = {[x, y, z]} */}
//   {/* args = {[width(x), height(y), depth(z)]} */}
//   {/* rotation = {[roll, pitch, yaw]} */}
//   {/* axis ={r: x, b: y, g: z} */}

//   {/* このシステム */}
//   {/* position = {[y, z, x]} */}
//   {/* args = {[height(y), width(x), depth(z)]} */}
//   {/* rotation = {[pitch, roll, yaw]} */}
//   {/* axis ={b: x, r: y, g: z} */}

const VehicleBody = ({ vehicle_data }) => {
  if (vehicle_data === {}) {
    return (<></>);
  }
  return (
    <>
      {/* TODO ホイール分浮いているので、削るかどうにかする */}
      {/* main */}
      <mesh position={[
        0,
        // vehicle_data.vehicle_height / 2,
        (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
        vehicle_data.wheel_base / 2]}>
        <boxGeometry args={[
          vehicle_data.wheel_tread,
          vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2,
          vehicle_data.wheel_base,
        ]} />
        <meshPhongMaterial color="#000088" />
      </mesh>

      {/* rear_overhang */}
      <mesh position={[0,
        // vehicle_data.vehicle_height / 2,
        (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
        -vehicle_data.rear_overhang / 2]}>
        <boxGeometry args={[
          vehicle_data.wheel_tread,
          vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2,
          vehicle_data.rear_overhang,
        ]} />
        <meshPhongMaterial color="blue" />
      </mesh>

      {/* front_overhang */}
      <mesh position={[0,
        (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
        vehicle_data.front_overhang / 2 + vehicle_data.wheel_base]}>
        <boxGeometry args={[
          vehicle_data.wheel_tread,
          vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2,
          vehicle_data.front_overhang,
        ]} />
        <meshPhongMaterial color="blue" />
      </mesh>
    </>
  );
}

const VehicleWheel = ({ vehicle_data }) => {
  const offset = 0.0;
  if (vehicle_data === {}) {
    return (<></>);
  }
  return (
    <>
      {/* rear_left */}
      <mesh position={[vehicle_data.wheel_tread / 2 - vehicle_data.wheel_width / 2 - offset, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[
          vehicle_data.wheel_radius, vehicle_data.wheel_radius,
          vehicle_data.wheel_width, 64
        ]} />
        <meshPhongMaterial color="red" />
      </mesh>

      {/* rear_right */}
      <mesh position={[-vehicle_data.wheel_tread / 2 + vehicle_data.wheel_width / 2 + offset, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[
          vehicle_data.wheel_radius, vehicle_data.wheel_radius,
          vehicle_data.wheel_width, 64
        ]} />
        <meshPhongMaterial color="red" />
      </mesh>

      {/* front_left */}
      <mesh position={[vehicle_data.wheel_tread / 2 - vehicle_data.wheel_width / 2 - offset, 0, vehicle_data.wheel_base]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[
          vehicle_data.wheel_radius, vehicle_data.wheel_radius,
          vehicle_data.wheel_width, 64
        ]} />
        <meshPhongMaterial color="red" />
      </mesh>

      {/* front_right */}
      <mesh position={[-vehicle_data.wheel_tread / 2 + vehicle_data.wheel_width / 2 + offset, 0, vehicle_data.wheel_base]}
        rotation={[Math.PI / 2, 0, Math.PI/2]}>
        <cylinderGeometry args={[
          vehicle_data.wheel_radius, vehicle_data.wheel_radius,
          vehicle_data.wheel_width, 64
        ]} />
        <meshPhongMaterial color="red" />
      </mesh>

    </>
  );
}

const VehicleSideOverhang = ({ vehicle_data }) => {
  if (vehicle_data === {}) {
    return (<></>);
  }
  return (
    <>
      <mesh position={[
        (vehicle_data.wheel_tread / 2 + vehicle_data.left_overhang / 2),
        (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
        (vehicle_data.wheel_base + vehicle_data.front_overhang - vehicle_data.rear_overhang) / 2
      ]}>
        <boxGeometry args={[
          vehicle_data.left_overhang, //y
          vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2, //z
          vehicle_data.front_overhang + vehicle_data.wheel_base + vehicle_data.rear_overhang,//x
        ]} />
        <meshPhongMaterial color="#aaaaff" />
      </mesh>

      <mesh position={[
        -(vehicle_data.wheel_tread / 2 + vehicle_data.right_overhang / 2),
        (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
        (vehicle_data.wheel_base + vehicle_data.front_overhang - vehicle_data.rear_overhang) / 2
      ]}>
        <boxGeometry args={[
          vehicle_data.right_overhang, //y
          vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2, //z
          vehicle_data.front_overhang + vehicle_data.wheel_base + vehicle_data.rear_overhang,//x
        ]} />
        <meshPhongMaterial color="#aaaaff" />
      </mesh>
    </>);
}

const Ground = ({ vehicle_data }) => {
  if (vehicle_data === {}) {
    return (<></>);
  }
  return (<>
    <mesh position={[0, -vehicle_data.wheel_radius, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[
        (vehicle_data.wheel_base + vehicle_data.front_overhang + vehicle_data.rear_overhang) * 2.5,
        (vehicle_data.wheel_base + vehicle_data.front_overhang + vehicle_data.rear_overhang) * 2.5
      ]} />
      <meshStandardMaterial color="rgba(255,255,255,1)" side={DoubleSide} />
    </mesh>
  </>)
}

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

            <Box> Three.jsで図を作って描画する</Box>
            <Box> 青:x, 橙:y , 緑:z</Box>
            <Box> 前輪：１輪 or ２輪 ( TODO: ラジオボタンで切り替え)</Box>
            <Box sx={{ height: "500px" }}>
              {Object.keys(vehicle_data).length > 0 &&
                <Canvas>
                  <axesHelper args={[3]} />
                  <gridHelper args={[5, 100]} />
                  <OrbitControls></OrbitControls>
                  <ambientLight intensity={0.1} />

                  <VehicleBody vehicle_data={vehicle_data} />
                  <VehicleWheel vehicle_data={vehicle_data} />
                  <VehicleSideOverhang vehicle_data={vehicle_data} />
                  <Ground vehicle_data={vehicle_data} />
                </Canvas>
              }
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}