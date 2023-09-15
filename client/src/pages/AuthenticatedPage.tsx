import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '../components/AppBar';
import SideBar, { SideBarHeader } from '../components/SideBar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function AuthenticatedPage(props: React.PropsWithChildren): React.ReactElement {
  const sideBarOpen = useSelector((state: RootState) => state.sideBar.open);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar sideBarOpen={sideBarOpen} />
      <SideBar variant="permanent" open={sideBarOpen} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <SideBarHeader />
        {props.children}
      </Box>
    </Box>
  );
}
