import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Alert, TextField, MenuItem } from '@mui/material';

interface Props {
  onScan: (text: string) => void;
}

interface Cam {
  id: string;
  label: string;
}

// Muestra la cámara y emite el texto del primer QR detectado.
// Incluye un selector para elegir la webcam (evita cámaras virtuales como OBS).
export default function QrScanner({ onScan }: Props) {
  const containerId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);
  const [cams, setCams] = useState<Cam[]>([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');

  // 1. Pedir permiso y listar cámaras al montar.
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || devices.length === 0) {
          setError('No se detectaron cámaras en este equipo.');
          return;
        }
        const list = devices.map((d) => ({ id: d.id, label: d.label || 'Cámara' }));
        setCams(list);
        // Preferir una cámara real (no OBS / virtual).
        const real = list.find((c) => !/obs|virtual|snap|droidcam/i.test(c.label)) ?? list[0];
        setSelected(real.id);
      })
      .catch(() => setError('No se pudo acceder a la cámara. Revisa los permisos del navegador.'));
  }, []);

  // 2. Iniciar (o reiniciar) el escáner cuando cambia la cámara seleccionada.
  useEffect(() => {
    if (!selected) return;
    const scanner = new Html5Qrcode(containerId.current);
    scannerRef.current = scanner;
    scannedRef.current = false;
    setError('');

    scanner
      .start(
        selected,
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (!scannedRef.current) {
            scannedRef.current = true;
            onScan(decodedText);
          }
        },
        () => { /* frames sin QR: ignorar */ }
      )
      .catch(() => setError('No se pudo iniciar esa cámara. Prueba con otra del selector.'));

    return () => {
      const s = scannerRef.current;
      if (s) {
        s.stop().then(() => s.clear()).catch(() => { /* ya detenido */ });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Box>
      {error && <Alert severity="warning" sx={{ mb: 1 }}>{error}</Alert>}
      {cams.length > 1 && (
        <TextField
          select size="small" label="Cámara" value={selected}
          onChange={(e) => setSelected(e.target.value)}
          sx={{ mb: 1, minWidth: 260 }}
        >
          {cams.map((c) => <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>)}
        </TextField>
      )}
      <Box
        id={containerId.current}
        sx={{ width: '100%', maxWidth: 320, mx: 'auto', '& video': { borderRadius: 2, width: '100%' } }}
      />
    </Box>
  );
}
