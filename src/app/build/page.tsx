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

import {
  APPBAR_HEIGHT,
  STATIC_COMPONENT_SIZE,
  getWindowDimensions
} from "~/app/components/common";


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
              <Typography variant='h4'>Build</Typography>
              <Divider sx={{ pb: 1 }}></Divider>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    <TableRow >
                      <TableCell>latest build date</TableCell>
                      <TableCell>日付（yyyyMMdd hh:mm:ss）。ただし、表示方法はlocalizeの必要あり</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>build option</TableCell>
                      <TableCell>--symlink-install、Release　など見れるように</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>build packages</TableCell>
                      <TableCell>見た目がうるさくなりそうなので、accordionなどで最初は隠す＋検索機能も必要</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>build log list</TableCell>
                      <TableCell>log/package/stderr.logが空ではないファイルリスト</TableCell>
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