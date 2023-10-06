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
    },
    action: {
      disabledBackground: '#89ABE3'
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
          borderWidth: '2px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#232F3B'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: '#FCF6F5'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#FCF6F5'
            }
          }
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#232F3B'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000'
        }
      }
    }
  }
});
