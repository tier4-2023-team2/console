"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import ListSubheader from '@mui/material/ListSubheader';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function BasicList({ static_component_size, window_size }) {
    const [open_sensor, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open_sensor);
    };
    return (
        <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            height: window_size.height - static_component_size.appbar.height
        }}>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <ListItemButton href="/">
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="System" />
                </ListItemButton>
                <ListItemButton href="/build">
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Build" />
                </ListItemButton>
                <ListItemButton href="/vehicle">
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Vehicle" />
                </ListItemButton>
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sensors" />
                    {open_sensor ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open_sensor} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="LiDAR" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Camera" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="IMU" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton href="/">
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="TF" />
                </ListItemButton>
            </List>
        </Box >
    );
}