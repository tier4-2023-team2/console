"use client";

import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, TextField, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CodeBlock, CopyBlock } from "react-code-blocks";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Lidar() {

  const [args, set_args] = React.useState([]);
  const [group, set_group] = React.useState([]);
  const [namespace, set_namespace] = React.useState("");
  const [preprocessor_src, set_preprocessor_src] = React.useState("");
  const [preprocessor_src_idx, set_preprocessor_src_idx] = React.useState(0);


  const [localization_src, set_localization_src] = React.useState("");
  const [localization_src_idx, set_localization_src_idx] = React.useState(0);

  const convert_lidar_arg_data = (arg_raw) => {
    set_args(arg_raw.map((ele) => {
      return {
        ...ele._attributes
      }
    }));
  }

  const convert_lidar_group_data = (group_raw) => {
    set_group(group_raw.map((ele, idx) => {
      const arg_list = ele.include.arg.map((att) => {
        const e = att._attributes;
        return {
          ...e
        }
      });
      return {
        namespace: ele["push-ros-namespace"]._attributes.namespace,
        args: arg_list,
        launch_file: ele.include._attributes,
        open: false
      }
    }));
  }
  React.useEffect(() => {
    console.log(group);
  }, [group])

  const get_lidar_launch = async () => {
    const response = await axios.get('/api/sensor/lidar', {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    });
    convert_lidar_arg_data(response.data.launch_json.launch.arg)
    convert_lidar_group_data(response.data.launch_json.launch.group.group)
    set_namespace(response.data.launch_json.launch.group["push-ros-namespace"]["_attributes"]["namespace"])

    set_preprocessor_src(response.data.preprocessor_src)
    set_preprocessor_src_idx(response.data.preprocessor_src_start_idx)


    set_localization_src(response.data.localization_src)
    set_localization_src_idx(response.data.localization_src_start_idx)

  };

  const copy = async (txt) => {
    await global.navigator.clipboard.writeText(txt);
  }

  React.useEffect(() => {
    get_lidar_launch();
  }, []);

  return (
    <>
      <Box display={"flex"}>
        <Typography variant='h4'>
          LiDAR(read only)
        </Typography>
        <Tooltip title={`このページではLiDAR設定ファイル状況の確認ができます`}>
          <InfoIcon />
        </Tooltip>
      </Box>
      {/* <Box display={"flex"}>
        description
      </Box> */}
      <Divider />
      <Box sx={{ ml: 2 }}>
        <Box>
          <Box display={"flex"}>
            <Typography variant='h5'>
              arg設定状況
            </Typography>
          </Box>
          <Divider />
          <Box >
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {args.map((ele, idx) => {
                    return (
                      <TableRow key={`arg_key_${idx}`}>
                        <TableCell>{ele.name}</TableCell>
                        <TableCell>{ele.default}</TableCell>
                        <TableCell>{ele.description}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Divider />

        <Box>
          <Box>
            <Typography variant='h5'>
              設定中のLiDAR
            </Typography>
          </Box>
          {group.map((ele, i) => {
            return (
              <>
                <Accordion >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1d-content" id="panel1d-header">
                    <Box display={"flex"}>
                      <Typography variant='h6'>{ele.namespace}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} key={`group_${i}`}>
                      <Table aria-label="simple table" size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              topic name
                            </TableCell>
                            <TableCell>
                              {`/sensor/${namespace}/${ele.namespace}/outlier_filtered/pointcloud`}
                              <Tooltip title={`copy topic name "/sensor/${namespace}/${ele.namespace}/outlier_filtered/pointcloud"`}>
                                <IconButton onClick={(evt) => {
                                  copy(`/sensor/${namespace}/${ele.namespace}`);
                                  evt.stopPropagation();
                                }}>
                                  <ContentCopyIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>include launch xml</TableCell>
                            <TableCell>{ele.launch_file.file}</TableCell>
                          </TableRow>
                          {ele.args.map((e, j) => {
                            return (
                              <TableRow key={`group_key_${i}_${j}`}>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.value}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>

                  </AccordionDetails>
                </Accordion>
              </>
            )
          })}
        </Box>
        <Box>
          <Box display={"flex"}>
            <Typography variant='h5'>
              pointcloud_preprocessor.launch.pyの設定状況
            </Typography>
            <Tooltip title={`"input_topics"にconcatするLiDARのトピックが設定されてるか確認してください`}>
              <InfoIcon />
            </Tooltip>
          </Box>

          <CodeBlock
            text={preprocessor_src}
            language={"python"}
            showLineNumbers={true}
            startingLineNumber={preprocessor_src_idx}
            wrapLines
          ></CodeBlock>
        </Box>


        <Box>
          <Box display={"flex"}>
            <Typography variant='h5'>
              localization.launch.xmlの設定状況
            </Typography>
            {/* <Tooltip title={`"input_topics"にconcatするLiDARのトピックが設定されてるか確認してください`}>
              <InfoIcon />
            </Tooltip> */}
          </Box>

          <CodeBlock
            text={localization_src}
            language={"xml"}
            showLineNumbers={true}
            startingLineNumber={localization_src_idx}
            wrapLines
          ></CodeBlock>
        </Box>
      </Box>
    </>
  );
}
