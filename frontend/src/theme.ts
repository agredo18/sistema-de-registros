import { createTheme } from '@mui/material/styles';

// Tema con los colores institucionales del SENA (verde).
const theme = createTheme({
  palette: {
    primary: { main: '#1565C0', dark: '#0D47A1', light: '#42A5F5', contrastText: '#ffffff' },
    secondary: { main: '#00304D' },
    background: { default: '#f2f5f9' },
    success: { main: '#2E7D32' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default theme;
