import React from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { SIDEBAR_WIDTH } from '../utils/const';
import { IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from 'react-redux';
import { toggle } from '../store/sideBarSlice';

interface AppBarProps extends MuiAppBarProps {
  sideBarOpen: boolean;
}

const AppBarWrapper = styled(MuiAppBar)<AppBarProps>(({ theme, sideBarOpen }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(sideBarOpen && {
    marginLeft: SIDEBAR_WIDTH,
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

export default function AppBar(props: AppBarProps): React.ReactElement {
  const dispatch = useDispatch();

  return (
    <AppBarWrapper position="fixed" sideBarOpen={props.sideBarOpen}>
      <Toolbar variant="dense">
        <IconButton
          color="inherit"
          onClick={() => dispatch(toggle())}
          edge="start"
          sx={{
            marginRight: 5,
            ...(props.sideBarOpen && { display: 'none' })
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Finence
        </Typography>
      </Toolbar>
    </AppBarWrapper>
  );
}