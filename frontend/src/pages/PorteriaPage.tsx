import { useState, type FormEvent } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Alert, Grid, Card, CardContent,
  Chip, List, ListItem, ListItemText, Divider, CircularProgress, Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { porteriaApi } from '../api';
import type { ScanResult } from '../types';
import QrScanner from '../components/QrScanner';

export default function PorteriaPage() {
  const [codigo, setCodigo] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const buscar = async (valor: string) => {
    const q = valor.trim();
    if (!q) return;
    setError(''); setOk(''); setResult(null); setLoading(true); setScanning(false);
    try {
      const data = await porteriaApi.scan(q);
      if (!data.success) {
        setError(data.message ?? 'Persona o QR no registrado.');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Error consultando la portería.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    buscar(codigo);
  };

  const confirmar = async () => {
    if (!result?.fk_persona || !result.movimiento_sugerido) return;
    setConfirmando(true); setError('');
    try {
      await porteriaApi.confirmar(result.fk_persona, result.movimiento_sugerido);
      setOk(`Se registró la ${result.movimiento_sugerido} de ${result.nombre}.`);
      setResult(null);
      setCodigo('');
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'No se pudo registrar el movimiento.');
    } finally {
      setConfirmando(false);
    }
  };

  const esEntrada = result?.movimiento_sugerido === 'entrada';

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Portería</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Escanea el código QR o digita la cédula de la persona.
      </Typography>

      <Paper sx={{ p: 3, mb: 2 }}>
        <form onSubmit={onSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              fullWidth label="Cédula o código QR" value={codigo}
              onChange={(e) => setCodigo(e.target.value)} autoFocus
            />
            <Button type="submit" variant="contained" startIcon={<SearchIcon />} sx={{ px: 3 }}>
              Buscar
            </Button>
            <Button
              variant="outlined" startIcon={<QrCodeScannerIcon />}
              onClick={() => { setScanning((s) => !s); setError(''); setOk(''); }}
            >
              {scanning ? 'Cerrar cámara' : 'Escanear'}
            </Button>
          </Stack>
        </form>

        {scanning && (
          <Box sx={{ mt: 2 }}>
            <QrScanner onScan={(text) => { setCodigo(text); buscar(text); }} />
          </Box>
        )}
      </Paper>

      {loading && <Box sx={{ textAlign: 'center', my: 3 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}

      {result && result.success && (
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PersonIcon color="primary" sx={{ fontSize: 42 }} />
                  <Box>
                    <Typography variant="h5">{result.nombre}</Typography>
                    <Typography color="text.secondary">
                      Documento: {result.documento || '—'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip size="small" label={result.rol} color="primary" variant="outlined" />
                      {result.programa && <Chip size="small" label={result.programa} variant="outlined" />}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth size="large" variant="contained"
                  color={esEntrada ? 'success' : 'secondary'}
                  startIcon={esEntrada ? <LoginIcon /> : <LogoutIcon />}
                  onClick={confirmar} disabled={confirmando}
                  sx={{ py: 1.5 }}
                >
                  {confirmando ? 'Registrando...' : `Confirmar ${result.movimiento_sugerido}`}
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Equipos registrados ({result.equipos?.length ?? 0})
            </Typography>
            {result.equipos && result.equipos.length > 0 ? (
              <List dense>
                {result.equipos.map((eq) => (
                  <ListItem key={eq.id} divider>
                    <ListItemText
                      primary={`${eq.tipo_equipo} · ${eq.marca} ${eq.modelo}`}
                      secondary={`Serial: ${eq.serial}  ·  Estado: ${eq.estado}` +
                        (eq.accesorios?.length ? `  ·  Accesorios: ${eq.accesorios.map((a) => a.tipo).join(', ')}` : '')}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" variant="body2">Sin equipos registrados.</Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
