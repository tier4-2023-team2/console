"use client";
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import FolderIcon from '@mui/icons-material/Folder';
import CloudIcon from '@mui/icons-material/Cloud';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { red, green, blue, grey, cyan, yellow } from '@mui/material/colors';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AirplanemodeInactiveIcon from '@mui/icons-material/AirplanemodeInactive';
export default function DenseAppBar({ appbar_height, ws_directory }) {
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '300px',
      [theme.breakpoints.up('sm')]: {
        width: '300px',
        '&:focus': {
          width: '300pxch',
        },
      },
    },
  }));
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense" sx={{ height: appbar_height }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Console app
          </Typography>
          <Search>
            <SearchIconWrapper>
              <FolderIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="workspace: "
              inputProps={{ 'aria-label': 'search' }}
              value={ws_directory}
            />
          </Search>
          <Box sx={{ pl: 3 }}>
            <AirplanemodeInactiveIcon sx={{ color: grey[400] }} />
            <AirplanemodeActiveIcon sx={{ color: yellow[600] }} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}