"use client"
import * as React from 'react';
import { Card, Box, Grid, Typography, Divider } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';

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
  const [build_result_data, set_build_result_data] = React.useState(DEFAULT_BUILD_DATA);
  const [locale, set_locale] = React.useState(dayjs.locale());

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

  return (
    <>
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
    </>
  );
}