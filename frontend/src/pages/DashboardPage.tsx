import { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, Button, CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import { dashboardApi } from '../api';
import type { ResumenDashboard, PersonaDentro } from '../types';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: color, color: '#fff', borderRadius: 2, p: 1.2, display: 'flex' }}>{icon}</Box>
          <Box>
            <Typography variant="h4" fontWeight={800}>{value}</Typography>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [dentro, setDentro] = useState<PersonaDentro[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    try {
      const [r, d] = await Promise.all([dashboardApi.resumen(), dashboardApi.personasDentro()]);
      setResumen(r); setDentro(d);
    } catch { /* noop */ } finally { setLoading(false); }
  };
  useEffect(() => { cargar(); }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button startIcon={<RefreshIcon />} onClick={cargar}>Actualizar</Button>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <StatCard icon={<PeopleIcon />} label="Personas dentro" value={resumen?.personas_dentro ?? 0} color="#1565C0" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<LoginIcon />} label="Entradas hoy" value={resumen?.entradas_hoy ?? 0} color="#0288D1" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<LogoutIcon />} label="Salidas hoy" value={resumen?.salidas_hoy ?? 0} color="#ed6c02" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<BadgeIcon />} label="Visitantes externos" value={resumen?.visitantes_externos ?? 0} color="#00304D" />
            </Grid>
          </Grid>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Personas actualmente dentro</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Documento</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Equipo principal</TableCell>
                    <TableCell>Hora de entrada</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dentro.map((p) => (
                    <TableRow key={p.fk_persona} hover>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell>{p.documento || '—'}</TableCell>
                      <TableCell><Chip size="small" label={p.rol} variant="outlined" /></TableCell>
                      <TableCell>{p.equipo_principal}</TableCell>
                      <TableCell>{new Date(p.fecha_hora).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {dentro.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center">Nadie dentro en este momento.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
