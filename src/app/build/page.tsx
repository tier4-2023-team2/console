"use client"
import * as React from 'react';

import DenseAppBar from '~/app/components/appbar';
import BasicList from '~/app/components/sidebar';
import { Card, Box, Grid, Typography, Divider } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';

import {
  APPBAR_HEIGHT,
  STATIC_COMPONENT_SIZE,
  getWindowDimensions
} from "~/app/components/common";
import axios from 'axios';


const DEFAULT_BUILD_DATA = {
  file_name: "events.log",
  build_data: 0,
  warn_size: 0,
  warn_list: [],
  no_release_package: [],
  no_symlink_install_package: [],
}

export default function Build() {
  const [ws_directory, set_ws_directory] = React.useState("~/integ_ws/autoware");
  const [build_result_data, set_build_result_data] = React.useState(DEFAULT_BUILD_DATA);
  const [window_size, set_window_size] = React.useState({
    width: 500,
    height: 900
  });
  const [locale, set_locale] = React.useState(dayjs.locale());

  React.useEffect(() => {
    set_window_size(getWindowDimensions());
    const onResize = (evt: Event) => {
      set_window_size(getWindowDimensions());
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const get_build_data = async () => {
    const response = await axios.get('/api/build', {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    });
    set_build_result_data(response.data);
  };
  React.useEffect(() => {
    get_build_data();
  }, []);

  // React.useEffect(() => {
  //   console.log(build_result_data)
  // }, [build_result_data])

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
              <Typography variant='h4'>Build Result Console</Typography>
              <Divider sx={{ pb: 1 }}></Divider>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    <TableRow >
                      <TableCell>latest build date</TableCell>
                      <TableCell>
                        <div>{(dayjs(build_result_data.build_date).locale(locale).format())}</div>
                        {/* 日付（yyyyMMdd hh:mm:ss）。ただし、表示方法はlocalizeの必要あり */}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>release build check</TableCell>
                      <TableCell>
                        {build_result_data.no_release_package.map((ele, idx) => {
                          return (<li key={`no_release_package_${idx}`}>{ele}</li>);
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>--symlink-install check</TableCell>

                      <TableCell>
                        {build_result_data.no_symlink_install_package.map((ele, idx) => {
                          return (<li key={`no_symlink_install_package_${idx}`}>{ele}</li>);
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>build error/warn log </TableCell>
                      <TableCell>
                        {/* {JSON.stringify(build_result_data.warn_list, null, "\t")} */}
                        <div> {build_result_data.file_name}で警告かエラーが出ているpackageリスト</div>
                        {Object.keys(build_result_data.warn_list).map((ele, idx) => {

                          return (<div key={`warn_${idx}`} >
                            <li>
                              {ele}
                              {/* {JSON.stringify(build_result_data.warn_list[ele])} */}
                            </li>
                          </div>);
                        })}

                      </TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>

            </Card>
          </Grid>
        </Grid>
      </Box >
    </>
  );
}