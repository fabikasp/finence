import { createTheme } from '@mui/material';

const PRIMARY_BACKGROUND_COLOR = '#101820';
const SECONDARY_BACKGROUND_COLOR = '#232F3B';
const PRIMARY_COLOR = '#89ABE3';
const SECONDARY_COLOR = '#C0C0C0';
const PRIMARY_TEXT_COLOR = '#FCF6F5';
const ALERT_COLOR = '#000000';

export const theme = createTheme({
  palette: {
    background: {
      default: PRIMARY_BACKGROUND_COLOR
    },
    primary: {
      main: PRIMARY_COLOR
    },
    secondary: {
      main: SECONDARY_COLOR
    },
    text: {
      primary: PRIMARY_TEXT_COLOR
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
          backgroundColor: PRIMARY_BACKGROUND_COLOR,
          borderColor: PRIMARY_COLOR,
          borderWidth: '2px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: SECONDARY_BACKGROUND_COLOR
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: PRIMARY_TEXT_COLOR
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: PRIMARY_TEXT_COLOR
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY_TEXT_COLOR
          },
          '& .MuiSvgIcon-root': {
            color: SECONDARY_COLOR
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: PRIMARY_TEXT_COLOR
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          backgroundColor: SECONDARY_BACKGROUND_COLOR
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
          backgroundColor: SECONDARY_BACKGROUND_COLOR
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          color: ALERT_COLOR,
          backgroundColor: PRIMARY_TEXT_COLOR
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: SECONDARY_COLOR,
          '&:hover': {
            color: PRIMARY_COLOR
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: SECONDARY_BACKGROUND_COLOR
        }
      }
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: PRIMARY_TEXT_COLOR
        }
      }
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: SECONDARY_BACKGROUND_COLOR
        }
      }
    },
    MuiTableSortLabel: {
      styleOverrides: {
        icon: {
          color: `${PRIMARY_TEXT_COLOR} !important`
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          '& .MuiSelect-icon': {
            color: PRIMARY_TEXT_COLOR
          }
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: SECONDARY_COLOR
        }
      }
    },
    MuiStep: {
      styleOverrides: {
        root: {
          '& .Mui-disabled': {
            '& .MuiStepIcon-root': {
              color: PRIMARY_COLOR,
              opacity: 0.6
            },
            color: PRIMARY_TEXT_COLOR,
            opacity: 0.6
          }
        }
      }
    }
  }
});
