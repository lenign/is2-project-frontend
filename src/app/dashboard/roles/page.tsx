'use client'

import { useState, useEffect, useCallback } from 'react'
import RoleCard from '@/components/RoleCard'
import Modal from '@/components/Modal'
import { api, RolDto, PermisoDto } from '@/lib/api'

const PALETTE = [
  { accentColor: '#e8616a', dotColor: '#e8616a' },
  { accentColor: '#1b8a60', dotColor: '#1b8a60' },
  { accentColor: '#d44f7e', dotColor: '#d44f7e' },
  { accentColor: '#e8a020', dotColor: '#e8a020' },
  { accentColor: '#3b5bdb', dotColor: '#3b5bdb' },
  { accentColor: '#6741d9', dotColor: '#6741d9' },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<RolDto[]>([])
  const [permisos, setPermisos] = useState<PermisoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editRol, setEditRol] = useState<RolDto | null>(null)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [r, p] = await Promise.all([api.roles.list(), api.permisos.list()])
      setRoles(r)
      setPermisos(p)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const permisosByRol = permisos.reduce<Record<number, PermisoDto[]>>((acc, p) => {
    ;(acc[p.rol_Id] ??= []).push(p)
    return acc
  }, {})

  const filtered = roles.filter(r =>
    r.descripcion.toLowerCase().includes(search.toLowerCase())
  )

  async function handleCreate() {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await api.roles.create(newName.trim())
      setNewName('')
      setCreateOpen(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!editRol || !newName.trim()) return
    setSaving(true)
    try {
      await api.roles.update(editRol.id_Rol, { descripcion: newName.trim() })
      setEditRol(null)
      setNewName('')
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este rol?')) return
    await api.roles.remove(id)
    await loadData()
  }

  async function handleToggle(rol: RolDto, value: boolean) {
    await api.roles.update(rol.id_Rol, { estado: value ? 1 : 0 })
    setRoles(prev => prev.map(r => r.id_Rol === rol.id_Rol ? { ...r, estado: value ? 1 : 0 } : r))
  }

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg outline-none"

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
          onClick={() => { setNewName(''); setCreateOpen(true) }}
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
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
          style={{ border: '1px solid var(--md-border)', background: '#fff', fontFamily: 'inherit' }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-sm" style={{ color: 'var(--md-text-secondary)' }}>Cargando roles...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((rol, idx) => {
            const rolPermisos = permisosByRol[rol.id_Rol] ?? []
            return (
              <RoleCard
                key={rol.id_Rol}
                name={rol.descripcion}
                description={`${rolPermisos.length} permiso${rolPermisos.length !== 1 ? 's' : ''} asignado${rolPermisos.length !== 1 ? 's' : ''}`}
                permissionCount={rolPermisos.length}
                permissions={rolPermisos.slice(0, 4).map(p => p.descripcion)}
                extraCount={Math.max(0, rolPermisos.length - 4)}
                accentColor={PALETTE[idx % PALETTE.length].accentColor}
                dotColor={PALETTE[idx % PALETTE.length].dotColor}
                defaultActive={rol.estado === 1}
                onToggle={v => handleToggle(rol, v)}
                onEdit={() => { setEditRol(rol); setNewName(rol.descripcion) }}
                onDelete={() => handleDelete(rol.id_Rol)}
              />
            )
          })}
        </div>
      )}

      {/* Modal crear */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Crear Nuevo Rol"
        subtitle="Ingresa el nombre del nuevo rol"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
              Nombre del Rol
            </label>
            <input
              type="text"
              placeholder="Ej: Enfermera"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              className={inputClass}
              style={{ border: '1.5px solid var(--md-green-dark)', fontFamily: 'inherit' }}
            />
          </div>
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setCreateOpen(false)}
              className="flex-1 py-2 text-sm rounded-lg hover:bg-gray-50"
              style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Guardando...' : 'Crear Rol'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal editar */}
      <Modal
        open={!!editRol}
        onClose={() => setEditRol(null)}
        title="Editar Rol"
        subtitle="Modifica el nombre del rol"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
              Nombre del Rol
            </label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEdit()}
              className={inputClass}
              style={{ border: '1.5px solid var(--md-green-dark)', fontFamily: 'inherit' }}
            />
          </div>
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setEditRol(null)}
              className="flex-1 py-2 text-sm rounded-lg hover:bg-gray-50"
              style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleEdit}
              disabled={saving}
              className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
