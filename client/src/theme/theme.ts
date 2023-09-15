import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    background: {
      default: '#101820'
    },
    text: {
      primary: '#FCF6F5'
    },
    primary: {
      main: '#89ABE3'
    },
    secondary: {
      main: '#C0C0C0'
    }
  },
  typography: {
    fontFamily: 'Helvetica',
    h5: {
      fontFamily: 'LeckerliOne'
    }
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#101820',
          borderColor: '#89ABE3',
          borderWidth: 2
        }
      }
    }
  }
});
