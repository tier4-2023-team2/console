"use client"
import { Box, Checkbox, Collapse, FormLabel, Grid, TextField, Typography } from '@mui/material';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as React from 'react';
import { Ground, MyAxes, Vehicle, Sensor, Model, QuatanionPoseForm } from '../components/vehicle_model_view';
import axios from 'axios';
import Link from 'next/link';
import { Mermaid } from 'mdx-mermaid/Mermaid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled';
import { Camera } from 'three';
import * as THREE from "three"
import { useState } from 'react';
import { useEffect } from 'react';
import { blue, green, red } from '@mui/material/colors';


const MERMAID_HEADER = "graph TD;"

const BASE_LINK = {
  x: 0,
  y: 0,
  z: 0,
  roll: 0,
  pitch: 0,
  yaw: 0,
}

const DEFAULT_POSE = {
  frame_id: "base_link",
  transform: {
    x: 0,
    y: 0,
    z: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
  }
}


export default function TF() {
  const [vehicle_data, set_vehicle_data] = React.useState({});
  const [vehicle_view, set_vehicle_view] = React.useState(true);
  const [sensor_link_map, set_sensor_link_map] = React.useState([]);
  const [mermaid_txt, set_mermaid_txt] = React.useState("graph TD;base_link;");
  const [check_all, set_check_all] = useState(true);
  const [pos_data, set_pos_data] = useState(DEFAULT_POSE);
  const [parents, set_parents] = useState([]);

  React.useEffect(() => {
    let mermaid_txt = MERMAID_HEADER;
    sensor_link_map.forEach((ele, idx) => {
      mermaid_txt += `base_link-->${ele.frame_id};`;
      if (ele.children !== undefined) {
        ele.children.forEach((ele2, j) => {
          mermaid_txt += `${ele.frame_id}-->${ele2.frame_id};`;
        })
      }
    });
    set_mermaid_txt(mermaid_txt);

  }, [sensor_link_map])


  useEffect(() => {
    set_sensor_link_map(sensor_link_map.map((ele) => {
      if (ele.children === undefined) {
        return {
          ...ele,
          view: check_all
        }
      }
      return {
        ...ele,
        view: check_all,
        children: ele.children.map((ele2) => {
          return {
            ...ele2,
            view: check_all
          }
        })
      }
    }));
  }, [check_all]);

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
    const base_link = (response.data.sensors_calib.data["base_link"]);
    const base_link_child = Object.keys(base_link).map((ele, idx) => {
      return {
        frame_id: ele,
        transform: base_link[ele],
        view: true
      }
    });
    const sensor_kit_base_link = (response.data.sensor_kit_calib.data["sensor_kit_base_link"]);
    const sensor_kit_base_link_child = Object.keys(sensor_kit_base_link).map((ele, idx) => {
      return {
        frame_id: ele,
        transform: sensor_kit_base_link[ele],
        view: true
      }
    })
    const sensor_link_map = base_link_child.map((ele, idx) => {
      if (ele.frame_id === "sensor_kit_base_link") {
        return {
          ...ele,
          children: sensor_kit_base_link_child
        }
      }
      return ele;
    })
    set_sensor_link_map(sensor_link_map);
  }

  React.useEffect(() => {
    get_vehicle_param();
    get_calib_param();
  }, [])

  const update_position = (val, i, j, prop) => {
    set_sensor_link_map(sensor_link_map.map((ele, idx) => {
      if (idx !== i) {
        return ele;
      } else {
        if (j !== undefined) {
          return {
            ...ele,
            children: ele.children.map((ele2, idx2) => {
              if (idx2 !== j) {
                return ele2;
              }
              return {
                ...ele2,
                transform: {
                  ...ele2.transform,
                  [prop]: parseFloat(val)
                }
              }
            })
          }
        } else {
          return {
            ...ele,
            transform: {
              ...ele.transform,
              [prop]: parseFloat(val)
            }
          }
        }
      }
    }));
  }

  const update_check = (val, i, j, prop) => {
    set_sensor_link_map(sensor_link_map.map((ele, idx) => {
      if (idx !== i) {
        return ele;
      } else {
        if (j !== undefined) {
          return {
            ...ele,
            children: ele.children.map((ele2, idx2) => {
              if (idx2 !== j) {
                return ele2;
              }
              return {
                ...ele2,
                view: val
              }
            })
          }
        } else {
          return {
            ...ele,
            view: val
          }
        }
      }
    }));
  }

  const TransFormCell = ({ transform, i, j }) => {
    const xyz_color = 800;
    const rpy_color = 500;
    return (<>
      <Box display={"flex"}>
        <Grid container>
          <Grid item xs={3}>
            <Typography variant='h8' sx={{ color: red[xyz_color] }}>X</Typography>
            <Typography variant='h8' sx={{ color: green[xyz_color] }}>Y</Typography>
            <Typography variant='h8' sx={{ color: blue[xyz_color] }}>Z</Typography>
          </Grid>
          <Grid item xs={3} sx={{ color: red[xyz_color] }}>  {transform.x} </Grid>
          <Grid item xs={3} sx={{ color: green[xyz_color] }}>  {transform.y}</Grid>
          <Grid item xs={3} sx={{ color: blue[xyz_color] }}>  {transform.z}</Grid>
        </Grid>
      </Box>
      <Box display={"flex"} sx={{ mt: 1 }}>
        <Grid container>
          <Grid item xs={3}>
            <Typography variant='h8' sx={{ color: red[rpy_color] }}>R</Typography>
            <Typography variant='h8' sx={{ color: green[rpy_color] }}>P</Typography>
            <Typography variant='h8' sx={{ color: blue[rpy_color] }}>Y</Typography>
          </Grid>
          <Grid item xs={3} sx={{ color: red[rpy_color] }}>{transform.roll} </Grid>
          <Grid item xs={3} sx={{ color: green[rpy_color] }}>{transform.pitch}</Grid>
          <Grid item xs={3} sx={{ color: blue[rpy_color] }}>{transform.yaw}</Grid>
        </Grid>
      </Box>
    </>);
  }


  const PoseForm = ({ transform, frame_id, parents }) => {
    return (<>

      <Box>
        <Typography variant="h6">
          Relative Position from parent
        </Typography>
      </Box>
      <Box display={"flex"}>
        <TextField label={"x"} value={transform["x"]} size="small"
          onChange={(evt) => {
            // update_position(evt.target.value, i, j, "x");
          }} />
        <TextField label={"y"} value={transform["y"]} size="small"
          onChange={(evt) => {
            // update_position(evt.target.value, i, j, "y");
          }} />
        <TextField label={"z"} value={transform["z"]} size="small"
          onChange={(evt) => {
            // update_position(evt.target.value, i, j, "z");
          }} />
      </Box>
      <Box display={"flex"} sx={{ mt: 1 }}>
        <TextField label={"roll"} value={transform["roll"]} size="small"
          onChange={(evt) => {
            // update_position(evt.target.value, i, j, "roll");
          }} />
        <TextField label={"pitch"} value={transform["pitch"]} size="small"
          onChange={(evt) => {
            // update_position(evt.target.value, i, j, "pitch");
          }} />
        <TextField label={"yaw"} value={transform["yaw"]} size="small"
          onChange={(evt) => {
            // update_position(evt.target.value, i, j, "yaw");
          }} />
      </Box>
      <QuatanionPoseForm transform={transform} parents={parents} />
    </>);
  }

  const GrandChild = ({ children, key_idx, parent }) => {
    return (<>
      {children.map((ele, idx) => {
        return (
          <TableRow key={`sensor_link_grandchild_${key_idx}_${idx}`} onClick={() => click_handler(ele, [...parent])}>
            <TableCell><Checkbox checked={ele.view} onClick={() => { update_check(!ele.view, key_idx, idx) }} /></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Box>{ele.frame_id}</Box>
              <Box>(delete frame)</Box>
            </TableCell>
            <TableCell>
              <TransFormCell frame_id={ele.frame_id} transform={ele.transform} i={key_idx} j={idx} />
            </TableCell>
          </TableRow>
        )
      })}
    </>);
  }

  useEffect(() => {
    console.log(pos_data)
  }, [pos_data])

  const click_handler = (target, parents_id) => {
    if (parents_id.length === 0) {
      set_pos_data(sensor_link_map.find((ele, idx) => {
        set_parents([DEFAULT_POSE]);
        return ele.frame_id === target.frame_id;
      }));
    } else {
      set_pos_data(sensor_link_map.find((ele, idx) => {
        return parents_id.find((e) => {
          set_parents([DEFAULT_POSE, ele]);
          return e === ele.frame_id;
        });
      }).children.find((ele) => {
        return target.frame_id === ele.frame_id;
      }));
    }
  }

  return (<>
    <Grid container suppressHydrationWarning={true}>
      <Grid>
        <Box display="flex">
          <Box sx={{ width: 900, height: 800, overflowY: "scroll" }} >
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small" >
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell colSpan={2} align="center">frame_id</TableCell>
                    {/* <TableCell colSpan={2} align="center"></TableCell> */}
                    <TableCell colSpan={3} align="center"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox checked={check_all} onClick={() => { set_check_all(!check_all) }} />
                    </TableCell>
                    <TableCell align="center">prarent</TableCell>
                    <TableCell align="center">child</TableCell>
                    <TableCell rowSpan={3} align="center">transform</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sensor_link_map.map((ele, idx) => {
                    if (ele.children === undefined) {
                      return (
                        <TableRow key={`sensor_link_${idx}`} onClick={() => click_handler(ele, [])}>
                          <TableCell><Checkbox checked={ele.view} onClick={() => { update_check(!ele.view, idx) }} /></TableCell>
                          <TableCell>
                            <Box>{ele.frame_id}</Box>
                            <Box>(append_child)</Box>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <TransFormCell frame_id={ele.frame_id} transform={ele.transform} i={idx} />
                          </TableCell>
                        </TableRow>);
                    } else {
                      return (
                        <>
                          <TableRow key={`sensor_link_${idx}`} onClick={() => click_handler(ele, [])}>
                            <TableCell><Checkbox checked={ele.view} onClick={() => { update_check(!ele.view, idx) }} /></TableCell>
                            <TableCell>
                              <Box>{ele.frame_id}</Box>
                              <Box>(append_child)</Box>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <TransFormCell frame_id={ele.frame_id} transform={ele.transform} i={idx} />
                            </TableCell>
                          </TableRow >
                          <GrandChild children={ele.children} key_idx={idx} parent={[ele.frame_id]} />
                        </>
                      );
                    }
                  })}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <Box>(append_parent)</Box>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

          </Box>
          <Box sx={{ height: "100%", width: "630px" }}>
            <Box sx={{ height: "100%", width: "inherit" }}>
              <Mermaid chart={mermaid_txt} />
            </Box>
            <Box sx={{ height: "400px", width: "inherit" }}>
              {Object.keys(vehicle_data).length > 0 &&
                <Canvas>
                  {/* <SceneRoot> */}
                  <MyAxes />
                  <gridHelper args={[5, 10]} />
                  <gridHelper args={[5, 10]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
                  <gridHelper args={[5, 10]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
                  <OrbitControls />
                  <ambientLight intensity={0.1} />
                  {/* <Model vehicle_data={vehicle_data} /> */}
                  {vehicle_view && <Vehicle vehicle_data={vehicle_data} />}
                  <Ground vehicle_data={vehicle_data} />
                  {sensor_link_map.map((ele, idx) => {
                    if (ele.children === undefined) {
                      if (ele.view) {
                        return <Sensor parents={[BASE_LINK]} child={ele.transform} frame_id={ele.frame_id} />
                      } else {
                        return (<></>)
                      }
                    }
                    return (<>
                      {ele.view && <Sensor parents={[BASE_LINK]} child={ele.transform} frame_id={ele.frame_id} />}
                      {ele.children.map((ele2) => {
                        if (ele2.view) {
                          return (<Sensor parents={[BASE_LINK, ele.transform]} child={ele2.transform} frame_id={ele2.frame_id} />);
                        } else {
                          return (<></>)
                        }
                      })}
                    </>);
                  })}
                  {/* </SceneRoot> */}
                </Canvas>
              }
            </Box>
            <Box>
              <Box>
                <Checkbox checked={vehicle_view} onClick={() => { set_vehicle_view(!vehicle_view) }} />
              </Box>
              {/* <Box>TODO:</Box>
              <Box>* UMLの図をxacroのマクロに沿ったsuffixをつける</Box>
              <Box>* 3D図側にセンサーの取り付け</Box>
              <Box>* 値の反映</Box>
              <Box>* 保存</Box>
              <Box>* テーブルからセンサーのCRUD</Box>
              <Box>* xacroファイルペースト用テキスト作成</Box> */}
              <Box>
                <PoseForm transform={pos_data.transform} frame_id={pos_data.frame_id} parents={parents} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid >
  </>);
}