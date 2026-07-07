import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import PorteriaPage from './pages/PorteriaPage';
import EquiposPage from './pages/EquiposPage';
import DashboardPage from './pages/DashboardPage';
import HistorialPage from './pages/HistorialPage';
import ExternosPage from './pages/ExternosPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<PorteriaPage />} />
                <Route path="/equipos" element={<EquiposPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/historial" element={<HistorialPage />} />
                <Route path="/externos" element={<ExternosPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
