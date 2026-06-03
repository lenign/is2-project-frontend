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
}
