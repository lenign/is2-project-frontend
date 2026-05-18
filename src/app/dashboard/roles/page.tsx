'use client'

import RoleCard from '@/components/RoleCard'

const ROLES = [
  {
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema',
    permissionCount: 12,
    permissions: ['Ver Pacientes', 'Editar Pacientes', 'Eliminar Pacientes', 'Crear Citas'],
    extraCount: 8,
    accentColor: '#e8616a',
    dotColor: '#e8616a',
  },
  {
    name: 'Médico',
    description: 'Gestión de pacientes, citas e historial médico',
    permissionCount: 8,
    permissions: ['Ver Pacientes', 'Editar Pacientes', 'Crear Citas', 'Ver Citas'],
    extraCount: 4,
    accentColor: '#1b8a60',
    dotColor: '#1b8a60',
  },
  {
    name: 'Enfermera',
    description: 'Visualización de pacientes y gestión de citas',
    permissionCount: 4,
    permissions: ['Ver Pacientes', 'Crear Citas', 'Ver Citas', 'Ver Historial'],
    extraCount: 0,
    accentColor: '#d44f7e',
    dotColor: '#d44f7e',
  },
  {
    name: 'Recepcionista',
    description: 'Gestión de citas y registro de pacientes',
    permissionCount: 5,
    permissions: ['Ver Pacientes', 'Editar Pacientes', 'Crear Citas', 'Ver Citas'],
    extraCount: 1,
    accentColor: '#e8a020',
    dotColor: '#e8a020',
  },
]

export default function RolesPage() {
  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>
            Gestión de Roles
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
            Configura los roles y asigna permisos para cada tipo de usuario
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
        >
          <i className="ti ti-plus" /> Nuevo Rol
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
        <input
          type="text"
          placeholder="Buscar roles..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
          style={{ border: '1px solid var(--md-border)', background: '#fff', fontFamily: 'inherit' }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {ROLES.map((role) => (
          <RoleCard key={role.name} {...role} />
        ))}
      </div>
    </div>
  )
}
