import React from 'react';
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { SIDEBAR_WIDTH } from '../utils/const';
import { Box, IconButton, IconButtonProps, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from 'react-redux';
import { toggle } from '../store/sideBarSlice';
import Logo from '../images/logo.png';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface AppBarWrapperProps extends AppBarProps {
  sideBarOpen: boolean;
}

const AppBarWrapper = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'sideBarOpen'
})<AppBarWrapperProps>(({ theme, sideBarOpen }) => ({
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

interface StyledIconButtonProps extends IconButtonProps {
  sideBarOpen: boolean;
}

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'sideBarOpen'
})<StyledIconButtonProps>(({ sideBarOpen }) => ({
  marginRight: 20,
  ...(sideBarOpen && { display: 'none' })
}));

export default function AppBar(): React.ReactNode {
  const dispatch = useDispatch();
  const sideBarOpen = useSelector((state: RootState) => state.sideBar.open);

  return (
    <AppBarWrapper position="fixed" sideBarOpen={sideBarOpen}>
      <Toolbar variant="dense">
        <StyledIconButton sideBarOpen={sideBarOpen} color="inherit" onClick={() => dispatch(toggle())} edge="start">
          <MenuIcon />
        </StyledIconButton>
        <Box component="img" src={Logo} width={30} />
        <Typography variant="h5" sx={{ marginLeft: 2 }}>
          Finence
        </Typography>
      </Toolbar>
    </AppBarWrapper>
  );
}
