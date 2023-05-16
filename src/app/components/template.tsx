"use client";

import * as React from 'react';
import { Box, Grid } from "@mui/material";
import DenseAppBar from "./appbar";
import BasicList from "./sidebar";
import axios from "axios";
import {
    APPBAR_HEIGHT,
    STATIC_COMPONENT_SIZE,
    getWindowDimensions,
    DEFAULT_SYSTEM_CONF,
    APPBAR_HEIGHT_OFFSET_Y
} from "~/app/components/common";

export default function Template({ children }) {
    const [system_config, set_system_config] = React.useState(DEFAULT_SYSTEM_CONF);
    const [ws_directory, set_ws_directory] = React.useState("");
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
    const get_system_data = async () => {
        const response = await axios.get('/api/system', {
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json',
            }
        });
        set_system_config(response.data);
    };
    React.useEffect(() => {
        get_system_data();
    }, []);
    return (<>
        <DenseAppBar appbar_height={APPBAR_HEIGHT} ws_directory={system_config.workspace} />
        <Box
            sx={{
                mt: 0,
                py: 0,
                display: "flex",
                width: "100%",
                height: `${window_size.height - APPBAR_HEIGHT}px`
            }} >
            <Grid container spacing={1} sx={{ height: "100%" }}>
                <Grid item xs={2}>
                    <BasicList static_component_size={STATIC_COMPONENT_SIZE} window_size={window_size} />
                </Grid>
                <Grid item xs={10} sx={{
                    height: "100%",
                    overflowY: "auto",
                }}>
                    {children}
                </Grid>
            </Grid >
        </Box >
    </>)
}