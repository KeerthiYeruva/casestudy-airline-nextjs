'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#174EA6',
      light: '#4D86D9',
      dark: '#0B2F6B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0096C7',
      light: '#48CAE4',
      dark: '#006D8F',
      contrastText: '#FFFFFF',
    },
    success: {
      50: '#ECFDF3',
      main: '#168A4A',
      light: '#3CB371',
      dark: '#0F5F35',
      contrastText: '#FFFFFF',
    },
    warning: {
      50: '#FFF7E6',
      main: '#D97706',
      light: '#F59E0B',
      dark: '#92400E',
      contrastText: '#1F2937',
    },
    error: {
      50: '#FEF2F2',
      main: '#C2410C',
      light: '#F97316',
      dark: '#7C2D12',
      contrastText: '#FFFFFF',
    },
    info: {
      50: '#EFF6FF',
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172033',
      secondary: '#5B6475',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Segoe UI", Aptos, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: 0 },
    h2: { fontWeight: 700, letterSpacing: 0 },
    h3: { fontWeight: 700, letterSpacing: 0 },
    h4: { fontWeight: 700, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: {
      fontWeight: 700,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F7F9FC',
        },
        a: {
          color: '#174EA6',
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 40,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: '#E2E8F0',
        },
        elevation1: {
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
        },
        elevation2: {
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: '#E2E8F0',
        },
        head: {
          backgroundColor: '#F1F5F9',
          color: '#334155',
          fontWeight: 700,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
