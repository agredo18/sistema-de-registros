import { useEffect, useState } from 'react';
import {
  Box, Paper, Grid, TextField, MenuItem, Button, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { reportesApi } from '../api';
import type { MovimientoReporte } from '../types';

export default function HistorialPage() {
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', tipo_movimiento: '', persona: '' });
  const [datos, setDatos] = useState<MovimientoReporte[]>([]);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      Object.entries(filtros).forEach(([k, v]) => { if (v) params[k] = v; });
      setDatos(await reportesApi.movimientos(params));
    } catch { /* noop */ } finally { setLoading(false); }
  };
  useEffect(() => { cargar(); }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Historial de movimientos</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} md={3}>
            <TextField fullWidth size="small" type="date" label="Desde" InputLabelProps={{ shrink: true }}
              value={filtros.fecha_inicio} onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField fullWidth size="small" type="date" label="Hasta" InputLabelProps={{ shrink: true }}
              value={filtros.fecha_fin} onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })} />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth size="small" label="Tipo" value={filtros.tipo_movimiento}
              onChange={(e) => setFiltros({ ...filtros, tipo_movimiento: e.target.value })}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="entrada">Entrada</MenuItem>
              <MenuItem value="salida">Salida</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" label="Persona" placeholder="nombre/cédula"
              value={filtros.persona} onChange={(e) => setFiltros({ ...filtros, persona: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={cargar}>Filtrar</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', my: 3 }}><CircularProgress /></Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha / hora</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Movimiento</TableCell>
                  <TableCell>Estado actual</TableCell>
                  <TableCell>Equipos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datos.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell>{new Date(m.fecha_hora).toLocaleString()}</TableCell>
                    <TableCell>{m.nombre}</TableCell>
                    <TableCell>{m.documento || '—'}</TableCell>
                    <TableCell>{m.rol}</TableCell>
                    <TableCell>
                      <Chip size="small" label={m.tipo_movimiento}
                        color={m.tipo_movimiento === 'entrada' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" variant="outlined" label={m.estado_actual}
                        color={m.estado_actual === 'Dentro' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      {m.equipos?.length
                        ? m.equipos.map((e) => `${e.marca} ${e.modelo}`).join(', ')
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {datos.length === 0 && (
                  <TableRow><TableCell colSpan={7} align="center">Sin movimientos.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
