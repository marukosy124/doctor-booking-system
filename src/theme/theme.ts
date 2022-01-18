import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();

export const customTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
      },
    },
  },
});
