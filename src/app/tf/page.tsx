"use client"
import { Box, Checkbox, Collapse, FormLabel, Grid, TextField, Typography } from '@mui/material';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as React from 'react';
import { Ground, MyAxes, Vehicle, Sensor } from '../components/vehicle_model_view';
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


const MERMAID_HEADER = "graph TD;"

const BASE_LINK = {
  x: 0,
  y: 0,
  z: 0,
  roll: 0,
  pitch: 0,
  yaw: 0,
}

export default function TF() {
  const [vehicle_data, set_vehicle_data] = React.useState({});
  const [vehicle_view, set_vehicle_view] = React.useState(true);
  const [sensor_link_map, set_sensor_link_map] = React.useState([]);
  const [mermaid_txt, set_mermaid_txt] = React.useState("graph TD;base_link;");

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
    return (<>
      <Box display={"flex"}>
        <TextField label={"x"} value={transform["x"]} size="small"
          onChange={(evt) => {
            update_position(evt.target.value, i, j, "x");
          }} />
        <TextField label={"y"} value={transform["y"]} size="small"
          onChange={(evt) => {
            update_position(evt.target.value, i, j, "y");
          }} />
        <TextField label={"z"} value={transform["z"]} size="small"
          onChange={(evt) => {
            update_position(evt.target.value, i, j, "z");
          }} />
      </Box>
      <Box display={"flex"} sx={{ mt: 1 }}>
        <TextField label={"roll"} value={transform["roll"]} size="small"
          onChange={(evt) => {
            update_position(evt.target.value, i, j, "roll");
          }} />
        <TextField label={"pitch"} value={transform["pitch"]} size="small"
          onChange={(evt) => {
            update_position(evt.target.value, i, j, "pitch");
          }} />
        <TextField label={"yaw"} value={transform["yaw"]} size="small"
          onChange={(evt) => {
            update_position(evt.target.value, i, j, "yaw");
          }} />
      </Box>
    </>);
  }

  const GrandChild = ({ children, key_idx }) => {
    return (<>
      {children.map((ele, idx) => {
        return (
          <TableRow key={`sensor_link_grandchild_${key_idx}_${idx}`}>
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
                    <TableCell><Checkbox checked={vehicle_view} onClick={() => { set_vehicle_view(!vehicle_view) }} /></TableCell>
                    <TableCell align="center">prarent</TableCell>
                    <TableCell align="center">child</TableCell>
                    <TableCell rowSpan={3} align="center">transform</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sensor_link_map.map((ele, idx) => {
                    if (ele.children === undefined) {
                      return (
                        <TableRow key={`sensor_link_${idx}`}>
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
                          <TableRow key={`sensor_link_${idx}`}>
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
                          <GrandChild children={ele.children} key_idx={idx} />
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
                  <MyAxes />
                  <gridHelper args={[5, 100]} />
                  <OrbitControls />
                  <ambientLight intensity={0.1} />
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
                      <Sensor parents={[BASE_LINK]} child={ele} />
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
              <Box>TODO:</Box>
              <Box>* UMLの図をxacroのマクロに沿ったsuffixをつける</Box>
              <Box>* 3D図側にセンサーの取り付け</Box>
              <Box>* 値の反映</Box>
              <Box>* 保存</Box>
              <Box>* テーブルからセンサーのCRUD</Box>
              <Box>* xacroファイルペースト用テキスト作成</Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid >
  </>);
}