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
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FCF6F5'
          },
          '& .MuiSvgIcon-root': {
            color: '#FCF6F5'
          },
          '&.Mui-focused .MuiSvgIcon-root': {
            color: '#89ABE3'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#FCF6F5'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          backgroundColor: '#232F3B'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: 15
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
          color: '#000000',
          backgroundColor: '#FCF6F5'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#C0C0C0',
          '&:hover': {
            color: '#89ABE3'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#232F3B'
        }
      }
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: '#FCF6F5'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#101820'
        }
      }
    }
  }
});
