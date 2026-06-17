const BASE = '/backend'

export interface RolDto {
  id_Rol: number
  descripcion: string
  estado: number
  fecha_Creacion: string
  fecha_Modificacion: string
}

export interface PermisoDto {
  id_Permiso: number
  descripcion: string
  rol_Id: number
  fecha_Creacion: string
  fecha_Modificacion: string
}

export interface HospitalDto {
  id_Hospital: number
  nombre: string
  direccion: string
  telefono: string
  fecha_Creacion: string
  fecha_Modificacion: string
}

export interface EspecialidadDto {
  id_Especialidad: number
  descripcion: string
  fecha_Creacion: string
  fecha_Modificacion: string
}

export interface TipoEmpleadoDto {
  id_Tipo: number
  descripcion: string
}

export interface EmpleadoDto {
  id_Empleado: number
  password: string
  hospital_Id: number
  rol_Id: number
  tipo_Empleado_Id: number
  fecha_Ingreso: string
  fecha_Modificacion: string
  hospital_Nombre: string
  rol_Nombre: string
  tipo_Empleado_Nombre: string
}

export interface PersonaDto {
  dNI: string
  nombre: string
  nombre_2?: string
  apellido: string
  apellido_2?: string
  telefono: string
  correo: string
  sexo: string
  fecha_Nacimiento: string
}

export interface DoctorDto {
  id_Doctor: number
  numero_Colegiatura: string
  persona: PersonaDto
  empleado: EmpleadoDto
  especialidad: EspecialidadDto
}

export interface PacienteDto {
  id_Paciente: number
  persona: PersonaDto
  fecha_Creacion: string
  fecha_Modificacion: string
}

export interface CitaDto {
  id_Cita: number
  paciente: PacienteDto
  doctor: DoctorDto
  fecha_Cita: string
}

export interface DiagnosticoDto {
  id_Diagnostico: number
  descripcion: string
  comentario?: string
  cita: CitaDto
}

export interface TipoMedicamentoDto {
  id_Tipo: number
  descripcion: string
}

export interface MedicamentoDto {
  id_Medicamento: number
  descripcion: string
  tipo_Medicamento_Id: number
  tipo_Nombre: string
}

export interface FacturaDto {
  id_Factura: number
  cita_Id: number
  monto: number
  metodo_Pago: string
  estado: string
  fecha_Creacion: string
  cita: CitaDto
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as T)
}

export const api = {
  roles: {
    list: () => req<RolDto[]>('/api/Rol'),
    create: (descripcion: string) =>
      req<RolDto>('/api/Rol', { method: 'POST', body: JSON.stringify({ descripcion }) }),
    update: (id: number, data: Partial<Pick<RolDto, 'descripcion' | 'estado'>>) =>
      req<RolDto>(`/api/Rol/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Rol/${id}`, { method: 'DELETE' }),
  },
  permisos: {
    list: () => req<PermisoDto[]>('/api/Permiso'),
    create: (descripcion: string, rol_Id: number) =>
      req<PermisoDto>('/api/Permiso', { method: 'POST', body: JSON.stringify({ descripcion, rol_Id }) }),
    update: (id: number, data: Partial<Pick<PermisoDto, 'descripcion' | 'rol_Id'>>) =>
      req<PermisoDto>(`/api/Permiso/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Permiso/${id}`, { method: 'DELETE' }),
  },
  hospitales: {
    list: () => req<HospitalDto[]>('/api/Hospital'),
    create: (data: { nombre: string; direccion: string; telefono: string }) =>
      req<HospitalDto>('/api/Hospital', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { nombre: string; direccion: string; telefono: string }) =>
      req<void>(`/api/Hospital/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Hospital/${id}`, { method: 'DELETE' }),
  },
  especialidades: {
    list: () => req<EspecialidadDto[]>('/api/Especialidad'),
    create: (descripcion: string) =>
      req<EspecialidadDto>('/api/Especialidad', { method: 'POST', body: JSON.stringify({ descripcion }) }),
    update: (id: number, descripcion: string) =>
      req<void>(`/api/Especialidad/${id}`, { method: 'PUT', body: JSON.stringify({ descripcion }) }),
    remove: (id: number) => req<void>(`/api/Especialidad/${id}`, { method: 'DELETE' }),
  },
  tiposEmpleado: {
    list: () => req<TipoEmpleadoDto[]>('/api/TipoEmpleado'),
    create: (descripcion: string) =>
      req<TipoEmpleadoDto>('/api/TipoEmpleado', { method: 'POST', body: JSON.stringify({ descripcion }) }),
    update: (id: number, descripcion: string) =>
      req<void>(`/api/TipoEmpleado/${id}`, { method: 'PUT', body: JSON.stringify({ descripcion }) }),
    remove: (id: number) => req<void>(`/api/TipoEmpleado/${id}`, { method: 'DELETE' }),
  },
  empleados: {
    list: () => req<EmpleadoDto[]>('/api/Empleado'),
    create: (data: { password: string; hospital_Id: number; rol_Id: number; tipo_Empleado_Id: number }) =>
      req<EmpleadoDto>('/api/Empleado', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { hospital_Id: number; rol_Id: number; tipo_Empleado_Id: number }) =>
      req<void>(`/api/Empleado/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Empleado/${id}`, { method: 'DELETE' }),
    byHospital: (hospitalId: number) => req<EmpleadoDto[]>(`/api/Empleado/hospital/${hospitalId}`),
  },
  doctores: {
    list: () => req<DoctorDto[]>('/api/Doctor'),
    create: (data: {
      numero_Colegiatura: string
      empleado: { password: string; hospital_Id: number; rol_Id: number; tipo_Empleado_Id: number }
      especialidad_Id: number
      persona: PersonaDto
    }) => req<DoctorDto>('/api/Doctor', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: {
      numero_Colegiatura: string
      persona: PersonaDto
      empleado: { hospital_Id: number; rol_Id: number; tipo_Empleado_Id: number }
    }) => req<void>(`/api/Doctor/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Doctor/${id}`, { method: 'DELETE' }),
  },
  pacientes: {
    list: () => req<PacienteDto[]>('/api/Paciente'),
    byDni: (dni: string) => req<PacienteDto>(`/api/Paciente/${dni}`),
    create: (data: {
      dNI: string; nombre: string; nombre_2?: string; apellido: string; apellido_2?: string
      telefono: string; correo: string; sexo: string; fecha_Nacimiento: string
    }) => req<PacienteDto>('/api/Paciente', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: {
      dNI: string; nombre: string; nombre_2?: string; apellido: string; apellido_2?: string
      telefono: string; correo: string; sexo: string; fecha_Nacimiento: string
    }) => req<void>(`/api/Paciente/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Paciente/${id}`, { method: 'DELETE' }),
  },
  citas: {
    list: () => req<CitaDto[]>('/api/Cita'),
    byPaciente: (pacienteId: number) => req<CitaDto[]>(`/api/Cita/paciente/${pacienteId}`),
    byDoctor: (doctorId: number) => req<CitaDto[]>(`/api/Cita/doctor/${doctorId}`),
    create: (data: { paciente_Id: number; doctor_Id: number; fecha_Cita: string }) =>
      req<CitaDto>('/api/Cita', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { paciente_Id: number; doctor_Id: number; fecha_Cita: string }) =>
      req<void>(`/api/Cita/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Cita/${id}`, { method: 'DELETE' }),
  },
  diagnosticos: {
    list: () => req<DiagnosticoDto[]>('/api/Diagnostico'),
    byDni: (dni: string) => req<DiagnosticoDto[]>(`/api/Diagnostico/${dni}`),
    byId: (id: number) => req<DiagnosticoDto>(`/api/Diagnostico/id/${id}`),
    create: (data: { descripcion: string; comentario?: string; cita_Id: number }) =>
      req<DiagnosticoDto>('/api/Diagnostico', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { descripcion: string; comentario?: string; cita_Id: number }) =>
      req<void>(`/api/Diagnostico/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Diagnostico/${id}`, { method: 'DELETE' }),
  },
  tiposMedicamento: {
    list: () => req<TipoMedicamentoDto[]>('/api/TipoMedicamento'),
    create: (descripcion: string) =>
      req<TipoMedicamentoDto>('/api/TipoMedicamento', { method: 'POST', body: JSON.stringify({ descripcion }) }),
    update: (id: number, descripcion: string) =>
      req<void>(`/api/TipoMedicamento/${id}`, { method: 'PUT', body: JSON.stringify({ descripcion }) }),
    remove: (id: number) => req<void>(`/api/TipoMedicamento/${id}`, { method: 'DELETE' }),
  },
  medicamentos: {
    list: () => req<MedicamentoDto[]>('/api/Medicamento'),
    create: (data: { descripcion: string; tipo_Medicamento_Id: number }) =>
      req<MedicamentoDto>('/api/Medicamento', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { descripcion: string; tipo_Medicamento_Id: number }) =>
      req<void>(`/api/Medicamento/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Medicamento/${id}`, { method: 'DELETE' }),
  },
  facturas: {
    list: () => req<FacturaDto[]>('/api/Factura'),
    byCita: (citaId: number) => req<FacturaDto[]>(`/api/Factura/cita/${citaId}`),
    create: (data: { cita_Id: number; monto: number; metodo_Pago: string; estado: string }) =>
      req<FacturaDto>('/api/Factura', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { cita_Id: number; monto: number; metodo_Pago: string; estado: string }) =>
      req<void>(`/api/Factura/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => req<void>(`/api/Factura/${id}`, { method: 'DELETE' }),
  },
}
