import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Button, Typography, AppBar, Toolbar, Container, Box } from '@mui/material';

// Кастомна тема
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700',
    },
    secondary: {
      main: '#303030',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    // Add custom color definitions for any future use
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA000',
    },
    info: {
      main: '#0288D1',
    },
    success: {
      main: '#388E3C',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
    },
    // Adding custom text styles for specific sections
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.875rem',
      color: '#BDBDBD',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#212121',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: '#FFD700',
        },
        h2: {
          color: '#FFD700',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Added rounded corners for cards
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)', // Light shadow for cards
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '50%', // Rounded icon buttons
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for alerts
        },
      },
    },
  },
});