import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
        contained: {
          backgroundColor: '#42a5f5',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          flexGrow: 1,
          alignItems: 'flex-end',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          userSelect: 'auto',
        },
      },
    },
  },
});
