import { useEffect, useState, type FormEvent } from 'react';
import {
  Box, Paper, Grid, TextField, Button, Typography, Alert, MenuItem, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip, Stack, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AddIcon from '@mui/icons-material/Add';
import QRCode from 'react-qr-code';
import { personasApi, equiposApi, qrApi } from '../api';
import type { Persona, Equipo } from '../types';

const TIPOS = ['portatil', 'tablet', 'celular', 'accesorio', 'otro'];

export default function EquiposPage() {
  const [cedula, setCedula] = useState('');
  const [persona, setPersona] = useState<Persona | null>(null);
  const [form, setForm] = useState({ tipo_equipo: 'portatil', marca: '', modelo: '', serial: '' });
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const cargarEquipos = async () => {
    try { setEquipos(await equiposApi.listar()); } catch { /* noop */ }
  };
  useEffect(() => { cargarEquipos(); }, []);

  const buscarPersona = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setOk(''); setPersona(null); setQrValue(null);
    try {
      setPersona(await personasApi.porCedula(cedula.trim()));
    } catch (err: any) {
      setError(err?.response?.status === 404 ? 'Persona no encontrada.' : 'Error buscando la persona.');
    }
  };

  const registrarEquipo = async (e: FormEvent) => {
    e.preventDefault();
    if (!persona) return;
    setError(''); setOk('');
    try {
      await equiposApi.crear({ fk_persona: persona.documento, ...form });
      setOk('Equipo registrado correctamente.');
      setForm({ tipo_equipo: 'portatil', marca: '', modelo: '', serial: '' });
      cargarEquipos();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'No se pudo registrar el equipo.');
    }
  };

  const generarQr = async () => {
    if (!persona) return;
    setError('');
    try {
      const qr = await qrApi.generar(persona.fk_persona);
      setQrValue(qr.codigo_qr);
      setQrOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'No se pudo generar el QR.');
    }
  };

  const eliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este equipo?')) return;
    try { await equiposApi.eliminar(id); cargarEquipos(); } catch { setError('No se pudo eliminar.'); }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Equipos y QR</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>1. Buscar persona</Typography>
            <form onSubmit={buscarPersona}>
              <Stack direction="row" spacing={1}>
                <TextField fullWidth size="small" label="Cédula" value={cedula}
                  onChange={(e) => setCedula(e.target.value)} />
                <Button type="submit" variant="contained" startIcon={<SearchIcon />}>Buscar</Button>
              </Stack>
            </form>

            {persona && (
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6">{persona.nombre}</Typography>
                  <Typography color="text.secondary">Documento: {persona.documento}</Typography>
                  <Chip size="small" label={persona.rol} color="primary" variant="outlined" sx={{ mt: 1 }} />
                  <Divider sx={{ my: 2 }} />
                  <Button fullWidth variant="outlined" startIcon={<QrCode2Icon />} onClick={generarQr}>
                    Generar / ver QR
                  </Button>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>2. Registrar equipo</Typography>
            {!persona && <Alert severity="info">Primero busca una persona.</Alert>}
            {persona && (
              <form onSubmit={registrarEquipo}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField select fullWidth size="small" label="Tipo" value={form.tipo_equipo}
                      onChange={(e) => setForm({ ...form, tipo_equipo: e.target.value })}>
                      {TIPOS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Marca" value={form.marca} required
                      onChange={(e) => setForm({ ...form, marca: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Modelo" value={form.modelo} required
                      onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Serial" value={form.serial} required
                      onChange={(e) => setForm({ ...form, serial: e.target.value })} />
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Registrar equipo
                </Button>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Equipos registrados</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Propietario</TableCell>
                <TableCell>Cédula</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Marca / Modelo</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipos.map((eq) => (
                <TableRow key={eq.id} hover>
                  <TableCell>{eq.nombre_propietario || '—'}</TableCell>
                  <TableCell>{eq.cedula_propietario || '—'}</TableCell>
                  <TableCell>{eq.tipo_equipo}</TableCell>
                  <TableCell>{eq.marca} {eq.modelo}</TableCell>
                  <TableCell>{eq.serial}</TableCell>
                  <TableCell><Chip size="small" label={eq.estado} /></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => eliminar(eq.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {equipos.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center">Sin equipos.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Dialog open={qrOpen} onClose={() => setQrOpen(false)}>
        <DialogTitle>QR de {persona?.nombre}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {qrValue && (
            <Box sx={{ background: '#fff', p: 2, display: 'inline-block' }}>
              <QRCode value={qrValue} size={220} />
            </Box>
          )}
          <Typography variant="caption" display="block" sx={{ mt: 2, wordBreak: 'break-all' }}>
            {qrValue}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.print()}>Imprimir</Button>
          <Button onClick={() => setQrOpen(false)} variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
