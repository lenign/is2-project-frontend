'use client'

import { useState, useEffect, useCallback } from 'react'
import Modal from '@/components/Modal'
import { api, PermisoDto, RolDto } from '@/lib/api'

type PermisoForm = { descripcion: string; rol_Id: number }

export default function PermisosPage() {
  const [permisos, setPermisos] = useState<PermisoDto[]>([])
  const [roles, setRoles] = useState<RolDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [rolFilter, setRolFilter] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [editPermiso, setEditPermiso] = useState<PermisoDto | null>(null)
  const [form, setForm] = useState<PermisoForm>({ descripcion: '', rol_Id: 0 })
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [p, r] = await Promise.all([api.permisos.list(), api.roles.list()])
      setPermisos(p)
      setRoles(r)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const rolMap = Object.fromEntries(roles.map(r => [r.id_Rol, r.descripcion]))

  const filtered = permisos.filter(p => {
    const matchSearch = p.descripcion.toLowerCase().includes(search.toLowerCase())
    const matchRol = rolFilter === 0 || p.rol_Id === rolFilter
    return matchSearch && matchRol
  })

  async function handleCreate() {
    if (!form.descripcion.trim() || !form.rol_Id) return
    setSaving(true)
    try {
      await api.permisos.create(form.descripcion.trim(), form.rol_Id)
      setCreateOpen(false)
      setForm({ descripcion: '', rol_Id: 0 })
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!editPermiso || !form.descripcion.trim() || !form.rol_Id) return
    setSaving(true)
    try {
      await api.permisos.update(editPermiso.id_Permiso, {
        descripcion: form.descripcion.trim(),
        rol_Id: form.rol_Id,
      })
      setEditPermiso(null)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este permiso?')) return
    await api.permisos.remove(id)
    await loadData()
  }

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--md-green-light)' }}
          >
            <i className="ti ti-shield text-lg" style={{ color: 'var(--md-green-dark)' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>
              Gestión de Permisos
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              Administra los permisos del sistema para controlar el acceso a funcionalidades
            </p>
          </div>
        </div>
        <button
          onClick={() => { setForm({ descripcion: '', rol_Id: 0 }); setCreateOpen(true) }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
        >
          <i className="ti ti-plus" /> Nuevo Permiso
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl p-5" style={{ border: '2px solid #1b8a60' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>
              Permisos del Sistema
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              {filtered.length} permiso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative flex-1" style={{ maxWidth: 320 }}>
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit' }}
            />
          </div>
          <select
            value={rolFilter}
            onChange={e => setRolFilter(Number(e.target.value))}
            className="text-sm rounded-lg px-3 py-2 outline-none"
            style={{ border: '1px solid var(--md-border)', background: '#fff', fontFamily: 'inherit', cursor: 'pointer' }}
          >
            <option value={0}>Todos los roles</option>
            {roles.map(r => <option key={r.id_Rol} value={r.id_Rol}>{r.descripcion}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-sm py-4" style={{ color: 'var(--md-text-secondary)' }}>Cargando permisos...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                {['Permiso', 'ID', 'Rol', 'Acciones'].map(h => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold pb-2 px-3"
                    style={{ color: 'var(--md-text-secondary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id_Permiso}
                  style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}
                >
                  <td className="text-sm px-3 py-2.5" style={{ color: 'var(--md-text-primary)' }}>
                    {p.descripcion}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{ background: '#f0f0f0', color: '#555' }}
                    >
                      #{String(p.id_Permiso).padStart(3, '0')}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded font-medium"
                      style={{ background: '#e8f5ee', color: '#1b6e47' }}
                    >
                      {rolMap[p.rol_Id] ?? `Rol #${p.rol_Id}`}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditPermiso(p); setForm({ descripcion: p.descripcion, rol_Id: p.rol_Id }) }}
                        className="text-gray-300 hover:text-gray-500 hover:bg-gray-100 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <i className="ti ti-pencil text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id_Permiso)}
                        className="text-gray-300 hover:text-red-400 hover:bg-red-50 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <i className="ti ti-trash text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal crear */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Crear Nuevo Permiso"
        subtitle="Ingresa los datos del nuevo permiso"
      >
        <PermisoFormFields
          form={form}
          roles={roles}
          saving={saving}
          submitLabel="Crear Permiso"
          onChange={setForm}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Modal editar */}
      <Modal
        open={!!editPermiso}
        onClose={() => setEditPermiso(null)}
        title="Editar Permiso"
        subtitle="Modifica los datos del permiso"
      >
        <PermisoFormFields
          form={form}
          roles={roles}
          saving={saving}
          submitLabel="Guardar cambios"
          onChange={setForm}
          onSubmit={handleEdit}
          onCancel={() => setEditPermiso(null)}
        />
      </Modal>
    </div>
  )
}

function PermisoFormFields({
  form,
  roles,
  saving,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: {
  form: PermisoForm
  roles: RolDto[]
  saving: boolean
  submitLabel: string
  onChange: (f: PermisoForm) => void
  onSubmit: () => void
  onCancel: () => void
}) {
  const base = { border: '1px solid var(--md-border)', fontFamily: 'inherit' }
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
          Descripción del Permiso
        </label>
        <input
          type="text"
          placeholder="Ej: Ver Pacientes"
          value={form.descripcion}
          onChange={e => onChange({ ...form, descripcion: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          className="w-full px-3 py-2 text-sm rounded-lg outline-none"
          style={{ ...base, border: '1.5px solid var(--md-green-dark)' }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
          Rol
        </label>
        <select
          value={form.rol_Id}
          onChange={e => onChange({ ...form, rol_Id: Number(e.target.value) })}
          className="w-full px-3 py-2 text-sm rounded-lg outline-none"
          style={{ ...base, background: '#fff', cursor: 'pointer' }}
        >
          <option value={0}>Seleccionar rol...</option>
          {roles.map(r => <option key={r.id_Rol} value={r.id_Rol}>{r.descripcion}</option>)}
        </select>
      </div>
      <div className="flex gap-2.5 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 text-sm rounded-lg hover:bg-gray-50"
          style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          disabled={saving}
          className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </div>
  )
}
