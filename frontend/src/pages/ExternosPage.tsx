import { useEffect, useState, type FormEvent } from 'react';
import {
  Box, Paper, Grid, TextField, Button, Typography, Alert, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { externosApi } from '../api';
import type { UsuarioExterno } from '../types';

export default function ExternosPage() {
  const [lista, setLista] = useState<UsuarioExterno[]>([]);
  const [form, setForm] = useState({ documento: '', nombre: '', empresa: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const cargar = async () => {
    try { setLista(await externosApi.listar()); } catch { /* noop */ }
  };
  useEffect(() => { cargar(); }, []);

  const crear = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setOk('');
    try {
      await externosApi.crear(form);
      setOk('Visitante externo registrado.');
      setForm({ documento: '', nombre: '', empresa: '' });
      cargar();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'No se pudo registrar.');
    }
  };

  const cambiarEstado = async (u: UsuarioExterno) => {
    const nuevo = u.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await externosApi.actualizar(u.id, { documento: u.documento, nombre: u.nombre, empresa: u.empresa, estado: nuevo });
      cargar();
    } catch { setError('No se pudo actualizar el estado.'); }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Visitantes externos</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Registrar visitante</Typography>
        <form onSubmit={crear}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth size="small" label="Documento" required value={form.documento}
                onChange={(e) => setForm({ ...form, documento: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth size="small" label="Nombre" required value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth size="small" label="Empresa" value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth type="submit" variant="contained" startIcon={<AddIcon />} sx={{ height: '100%' }}>
                Agregar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Listado</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Documento</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lista.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.documento}</TableCell>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.empresa || '—'}</TableCell>
                  <TableCell>
                    <Chip size="small" label={u.estado}
                      color={u.estado === 'activo' ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => cambiarEstado(u)}>
                      {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {lista.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center">Sin visitantes externos.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
