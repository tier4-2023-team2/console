"use client"
import { Box, Button, Checkbox, Collapse, FormControl, FormLabel, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

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

  const PoseForm = ({ transform, frame_id, parents, update_handler }) => {
    const [form, set_form] = useState(transform);
    const [transform2, set_transform2] = useState(transform);
    useEffect(() => {
    }, [form]);

    const update = () => {
      const valid = Object.keys(form).every((ele) => {
        return isFinite(parseFloat(form[ele]));
      })
      if (valid) {
        const new_form = {
          x: form.x,
          y: form.y,
          z: form.z,
          roll: form.roll,
          pitch: form.pitch,
          yaw: form.yaw,
        };
        set_form(new_form)
        set_transform2(new_form);
        update_handler(new_form, frame_id, parents);
      }
    }

    return (<>
      <Box>
        <Typography variant="h6">
          frame_id : {frame_id}
        </Typography>
      </Box>
      <Box>
        <TextField size="small" label="Tree Structure" fullWidth InputProps={{
          readOnly: true,
        }}
          defaultValue={[...parents, { frame_id: frame_id }].map((ele, idx) => {
            return `${ele.frame_id}`
          }).join(" > ")}
        />
      </Box>

      <Box>
        <Typography variant="h6">
          Relative Position from parent
        </Typography>
      </Box>
      <Box display={"flex"}>
        <TextField label={"x"} value={form["x"]} size="small"
          onChange={(evt) => {
            set_form({
              ...form,
              x: evt.target.value
            });
          }} />
        <TextField label={"y"} value={form["y"]} size="small"
          onChange={(evt) => {
            set_form({
              ...form,
              y: evt.target.value
            });
          }} />
        <TextField label={"z"} value={form["z"]} size="small"
          onChange={(evt) => {
            set_form({
              ...form,
              z: evt.target.value
            });
          }} />
      </Box>
      <Box display={"flex"} sx={{ mt: 1 }}>
        <TextField label={"roll"} value={form["roll"]} size="small"
          onChange={(evt) => {
            set_form({
              ...form,
              roll: evt.target.value
            });
          }} />
        <TextField label={"pitch"} value={form["pitch"]} size="small"
          onChange={(evt) => {
            set_form({
              ...form,
              pitch: evt.target.value
            });
          }} />
        <TextField label={"yaw"} value={form["yaw"]} size="small"
          onChange={(evt) => {
            set_form({
              ...form,
              yaw: evt.target.value
            });
          }} />
      </Box>
      <Box>
        <Box display={"flex"} sx={{ mt: 1 }} className="justify-end">
          <Button onClick={() => { update() }}> Update </Button>
        </Box>
      </Box>
      <QuatanionPoseForm transform={transform2} parents={parents} />
    </>);
  }

  const GrandChild = ({ children, key_idx, parent }) => {
    return (<>
      {children.map((ele, idx) => {
        return (
          <TableRow key={`sensor_link_grandchild_${key_idx}_${idx}`} onClick={() => click_handler(ele, [...parent])}>
            <TableCell><Checkbox checked={ele.view} onClick={(evt) => {
              update_check(!ele.view, key_idx, idx);
              evt.stopPropagation();
            }} /></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Box display={"flex"}>
                <Typography sx={{ py: "8px" }}>{ele.frame_id}</Typography>
                <IconButton onClick={(evt) => { evt.stopPropagation() }}>
                  <HighlightOffIcon />
                </IconButton>
              </Box>
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
    console.log(target, parents_id)
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

  useEffect(() => {
    if (pos_data !== "base_link") {

    }
  }, [sensor_link_map]);

  const update_handler = React.useCallback((form, frame_id, parents) => {
    if (parents.length === 1) {
      const new_link = sensor_link_map.map((ele) => {
        if (frame_id === ele.frame_id) {
          return {
            ...ele,
            transform: form
          }
        }
        return ele;
      });
      set_sensor_link_map(new_link);
      set_pos_data(new_link.find((ele, idx) => {
        set_parents([DEFAULT_POSE]);
        return ele.frame_id === frame_id;
      }));
    } else if (parents.length === 2) {
      const new_link = sensor_link_map.map((ele) => {
        if (ele.children === undefined) {
          return ele;
        }
        return {
          ...ele,
          children: ele.children.map((ele2) => {
            console.log(frame_id, ele2.frame_id)
            if (frame_id === ele2.frame_id) {
              return {
                ...ele2,
                transform: form
              }
            }
            return ele2;
          })
        }
      })
      set_sensor_link_map(new_link);
      const new_pos = new_link.find((ele, idx) => {
        return parents.find((e) => {
          set_parents([DEFAULT_POSE, ele]);
          return e.frame_id === ele.frame_id;
        });
      }).children.find((ele) => {
        return frame_id === ele.frame_id;
      });
      set_pos_data(new_pos);
    }

  }, [sensor_link_map]);

  return (<>
    <Grid container suppressHydrationWarning={true}>
      <Grid>
        <Box>
          <Button>Upload</Button>
        </Box>
        <Box display="flex">
          <Box sx={{ width: 800, height: 800, overflowY: "scroll" }} >
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
                      <Checkbox checked={check_all} onClick={(evt) => {
                        set_check_all(!check_all);
                        evt.stopPropagation();
                      }} />
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
                          <TableCell><Checkbox checked={ele.view}
                            onClick={(evt) => {
                              update_check(!ele.view, idx);
                              evt.stopPropagation();
                            }} /></TableCell>
                          <TableCell>
                            <Box>
                              <Typography sx={{ py: "8px" }}>{ele.frame_id}</Typography>
                              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" sx={{ p: 0, m: 0 }}>
                                <InputLabel htmlFor="new_link_name">new_link_name</InputLabel>
                                <OutlinedInput
                                  id="new_link_name"
                                  type={'text'}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        edge="end"
                                      >
                                        <AddCircleOutlineRoundedIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label="new_link_name"
                                />
                              </FormControl>
                            </Box>
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
                              <Box>
                                <Typography sx={{ py: "8px" }}>{ele.frame_id}</Typography>
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" sx={{ p: 0, m: 0 }}>
                                  <InputLabel htmlFor="new_link_name">new_link_name</InputLabel>
                                  <OutlinedInput
                                    id="new_link_name"
                                    type={'text'}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <IconButton edge="end"                                        >
                                          <AddCircleOutlineRoundedIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                    label="new_link_name"
                                  />
                                </FormControl>
                              </Box>
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
                    <TableCell >
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" sx={{ p: 0, m: 0 }}>
                        <InputLabel htmlFor="new_link_name">new_link_name</InputLabel>
                        <OutlinedInput
                          id="new_link_name"
                          type={'text'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                              >
                                <AddCircleOutlineRoundedIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                          label="new_link_name"
                        />
                      </FormControl>
                    </TableCell>
                    <TableCell>

                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ height: "100%", width: "630px" }}>
            {/* <Box sx={{ height: "100%", width: "inherit" }}>
              <Mermaid chart={mermaid_txt} />
            </Box> */}
            <Box sx={{ height: "400px", width: "inherit" }}>
              {Object.keys(vehicle_data).length > 0 &&
                <Canvas>
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
                </Canvas>
              }
            </Box>
            <Box>
              <Box>
                <Checkbox checked={vehicle_view} onClick={(evt) => {
                  set_vehicle_view(!vehicle_view);
                }} />
              </Box>
              <Box>
                <PoseForm transform={pos_data.transform} frame_id={pos_data.frame_id} parents={parents} update_handler={update_handler} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid >
  </>);
}
