export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

export interface Persona {
  fk_persona: string;
  nombre: string;
  documento: string;
  correo?: string;
  telefono?: string;
  rol: string;
  programa?: string;
}

export interface Accesorio {
  id: number;
  fk_equipo: number;
  tipo: string;
  descripcion: string;
}

export interface Equipo {
  id: number;
  fk_persona: string;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  serial: string;
  estado: string;
  fecha_registro?: string;
  // Presentes en el listado enriquecido (GET /equipos/)
  nombre_propietario?: string;
  cedula_propietario?: string;
}

export interface EquipoScan {
  id: number;
  marca: string;
  modelo: string;
  serial: string;
  estado: string;
  tipo_equipo: string;
  accesorios: Accesorio[];
}

export interface ScanResult {
  success: boolean;
  message?: string;
  fk_persona?: string;
  nombre?: string;
  documento?: string;
  rol?: string;
  programa?: string;
  movimiento_sugerido?: 'entrada' | 'salida';
  equipos?: EquipoScan[];
}

export interface QR {
  id: number;
  fk_persona: string;
  codigo_qr: string;
  activo: boolean;
  fecha_generacion: string;
}

export interface ResumenDashboard {
  personas_dentro: number;
  entradas_hoy: number;
  salidas_hoy: number;
  visitantes_externos: number;
}

export interface PersonaDentro {
  fk_persona: string;
  nombre: string;
  documento: string;
  rol: string;
  ultimo_movimiento: string;
  fecha_hora: string;
  equipo_principal: string;
  equipos: EquipoScan[];
}

export interface MovimientoReporte {
  id: number;
  fk_persona: string;
  nombre: string;
  documento: string;
  rol: string;
  programa: string;
  tipo_movimiento: string;
  observacion?: string;
  fecha_hora: string;
  estado_actual: string;
  equipos: { marca: string; modelo: string; tipo_equipo: string }[];
}

export interface UsuarioExterno {
  id: number;
  documento: string;
  nombre: string;
  empresa?: string;
  estado: string;
}
