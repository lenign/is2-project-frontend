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
}
