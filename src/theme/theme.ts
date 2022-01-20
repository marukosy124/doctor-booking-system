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
  },
});
