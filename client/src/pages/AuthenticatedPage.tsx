import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import AppBar from '../components/AppBar';
import SideBar, { SideBarHeader } from '../components/SideBar';

export default function AuthenticatedPage(props: React.PropsWithChildren): React.ReactNode {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <SideBarHeader />
        {props.children}
      </Box>
    </Box>
  );
}
