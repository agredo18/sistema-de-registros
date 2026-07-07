import api from './client';
import type {
  LoginResponse, Usuario, Persona, Equipo, ScanResult, QR,
  ResumenDashboard, PersonaDentro, MovimientoReporte, UsuarioExterno,
} from '../types';

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }).then((r) => r.data),
  me: () => api.get<Usuario>('/auth/me').then((r) => r.data),
};

// ─── Personas ────────────────────────────────────────────────────────────────
export const personasApi = {
  porCedula: (cedula: string) =>
    api.get<Persona>(`/personas/identificacion/${cedula}`).then((r) => r.data),
  buscar: (q: string) =>
    api.get<{ id: string; nombre: string; documento: string; rol: string }[]>(
      `/personas/buscar`, { params: { q } }
    ).then((r) => r.data),
};

// ─── Equipos ─────────────────────────────────────────────────────────────────
export const equiposApi = {
  listar: (params?: { tipo_equipo?: string; fk_persona?: string; estado?: string }) =>
    api.get<Equipo[]>('/equipos/', { params }).then((r) => r.data),
  crear: (data: { fk_persona: string; tipo_equipo: string; marca: string; modelo: string; serial: string }) =>
    api.post<Equipo>('/equipos/', data).then((r) => r.data),
  eliminar: (id: number) => api.delete(`/equipos/${id}`).then((r) => r.data),
};

// ─── QR ──────────────────────────────────────────────────────────────────────
export const qrApi = {
  generar: (personaId: string) => api.post<QR>(`/qr/${personaId}`).then((r) => r.data),
};

// ─── Portería ────────────────────────────────────────────────────────────────
export const porteriaApi = {
  scan: (codigo: string) =>
    api.get<ScanResult>(`/porteria/scan/${encodeURIComponent(codigo)}`).then((r) => r.data),
  confirmar: (fk_persona: string, tipo_movimiento: string) =>
    api.post<{ success: boolean; message: string; id: number }>(
      '/porteria/confirmar', { fk_persona, tipo_movimiento }
    ).then((r) => r.data),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  resumen: () => api.get<ResumenDashboard>('/dashboard/resumen').then((r) => r.data),
  personasDentro: () => api.get<PersonaDentro[]>('/dashboard/personas-dentro').then((r) => r.data),
};

// ─── Reportes ────────────────────────────────────────────────────────────────
export const reportesApi = {
  movimientos: (params?: {
    fecha_inicio?: string; fecha_fin?: string; tipo_movimiento?: string; persona?: string;
  }) => api.get<MovimientoReporte[]>('/reportes/movimientos', { params }).then((r) => r.data),
};

// ─── Usuarios externos ───────────────────────────────────────────────────────
export const externosApi = {
  listar: () => api.get<UsuarioExterno[]>('/externos/').then((r) => r.data),
  crear: (data: { documento: string; nombre: string; empresa?: string }) =>
    api.post<UsuarioExterno>('/externos/', data).then((r) => r.data),
  actualizar: (id: number, data: { documento: string; nombre: string; empresa?: string; estado: string }) =>
    api.put<UsuarioExterno>(`/externos/${id}`, data).then((r) => r.data),
};
