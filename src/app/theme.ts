'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      50: '#EEF6FF',
      100: '#DCEBFF',
      main: '#174EA6',
      light: '#4D86D9',
      dark: '#0B2F6B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      50: '#E8FAFF',
      100: '#CFF4FF',
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
      100: '#FFE8B5',
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
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
        },
        a: {
          color: theme.palette.primary.main,
          textDecoration: 'none',
        },
      }),
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
        root: ({ theme }) => ({
          backgroundImage: 'none',
          borderColor: theme.palette.divider,
          '.staff-checkin &.flight-details': {
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: theme.palette.primary.contrastText,
            '& .MuiTypography-root': {
              color: theme.palette.primary.contrastText,
            },
            '& .MuiTypography-body2': {
              opacity: 0.9,
            },
          },
          '.inflight &.flight-details': {
            background: `linear-gradient(130deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 52%, ${theme.palette.secondary.main} 100%)`,
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: theme.palette.primary.contrastText,
            '& .MuiTypography-root': {
              color: theme.palette.primary.contrastText,
            },
            '& .MuiTypography-body2': {
              opacity: 0.9,
            },
          },
        }),
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
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
        }),
        head: ({ theme }) => ({
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.text.primary,
          fontWeight: 700,
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottomColor: 'inherit',
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
        root: ({ theme }) => ({
          borderRadius: 8,
          backgroundColor: theme.palette.background.paper,
        }),
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
