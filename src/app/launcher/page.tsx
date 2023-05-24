"use client"
import * as React from 'react';
import axios from "axios";

import { Card, Box, Grid, Typography, Divider, TextField, Button, FormGroup, FormControlLabel, Switch } from '@mui/material';


export default function Launcher() {
  const [config_list, set_config_list] = React.useState([]);

  const launch_req = async (prop) => {
    const suffix = config_list.reduce((sum, ele) => {
      return sum + `${ele.configname}:=${ele.use} `;
    }, "");
    console.log(suffix)
    const response = await axios.post('/api/launcher',
      {
        suffix: suffix
      }
      , {
        headers: {
          "Content-Type": 'application/json',
          Accept: 'application/json',
        }
      });
    console.log(response);
  }
  const get_config_list = async () => {
    const response = await axios.get('/api/launcher',
      {
        headers: {
          "Content-Type": 'application/json',
          Accept: 'application/json',
        }
      });
    set_config_list(response.data.config_list.map((ele) => {
      return {
        configname: ele,
        use: true
      }
    }))
  }
  React.useEffect(() => {
    get_config_list();
  }, []);
  React.useEffect(() => {
    console.log(config_list)
  }, [config_list]);

  return (<>

    <Box>

      <FormGroup>
        {config_list.map((ele, idx) => {
          return (<FormControlLabel key={`config_list_${idx}`}
            control={<Switch checked={ele.use} onChange={(evt) => {
              set_config_list(config_list.map((e) => {
                if (e.configname === ele.configname) {
                  return {
                    configname: e.configname,
                    use: evt.target.checked
                  }
                }
                return e;
              }))
            }} />} label={ele.configname} />);
        })}
      </FormGroup>
    </Box>

    <Box>
      <Button onClick={() => {
        launch_req({
          package: "",
          launch: "",
          suffix: "",
        })
      }}>
        launch</Button>
    </Box>
  </>);
}