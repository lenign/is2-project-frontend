'use client'

import { useState, useEffect, useCallback } from 'react'
import Modal from '@/components/Modal'
import { api, PacienteDto } from '@/lib/api'

type PacienteForm = {
  dNI: string; nombre: string; nombre_2: string; apellido: string; apellido_2: string
  telefono: string; correo: string; sexo: string; fecha_Nacimiento: string
}

const emptyForm: PacienteForm = {
  dNI: '', nombre: '', nombre_2: '', apellido: '', apellido_2: '',
  telefono: '', correo: '', sexo: '', fecha_Nacimiento: '',
}

function fullName(p: PacienteDto) {
  const parts = [p.persona.nombre, p.persona.nombre_2, p.persona.apellido, p.persona.apellido_2]
  return parts.filter(Boolean).join(' ')
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<PacienteDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editPaciente, setEditPaciente] = useState<PacienteDto | null>(null)
  const [form, setForm] = useState<PacienteForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      setPacientes(await api.pacientes.list())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = pacientes.filter(p => {
    const q = search.toLowerCase()
    return (
      fullName(p).toLowerCase().includes(q) ||
      p.persona.dNI.toLowerCase().includes(q) ||
      p.persona.correo.toLowerCase().includes(q)
    )
  })

  function openCreate() {
    setError('')
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEdit(p: PacienteDto) {
    setError('')
    setForm({
      dNI: p.persona.dNI,
      nombre: p.persona.nombre,
      nombre_2: p.persona.nombre_2 ?? '',
      apellido: p.persona.apellido,
      apellido_2: p.persona.apellido_2 ?? '',
      telefono: p.persona.telefono,
      correo: p.persona.correo,
      sexo: p.persona.sexo,
      fecha_Nacimiento: p.persona.fecha_Nacimiento?.slice(0, 10) ?? '',
    })
    setEditPaciente(p)
  }

  function validate(f: PacienteForm): string {
    if (!f.dNI.trim() || f.dNI.trim().length < 5) return 'El DNI debe tener al menos 5 caracteres.'
    if (!f.nombre.trim() || f.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.'
    if (!f.apellido.trim() || f.apellido.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres.'
    if (f.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) return 'El correo no tiene un formato válido.'
    if (!f.sexo) return 'Selecciona el sexo.'
    return ''
  }

  async function handleCreate() {
    const validErr = validate(form)
    if (validErr) { setError(validErr); return }
    setSaving(true)
    setError('')
    try {
      await api.pacientes.create({
        dNI: form.dNI.trim(),
        nombre: form.nombre.trim(),
        nombre_2: form.nombre_2.trim() || undefined,
        apellido: form.apellido.trim(),
        apellido_2: form.apellido_2.trim() || undefined,
        telefono: form.telefono.trim(),
        correo: form.correo.trim(),
        sexo: form.sexo,
        fecha_Nacimiento: form.fecha_Nacimiento,
      })
      setCreateOpen(false)
      await loadData()
    } catch {
      setError('Error al crear el paciente. Verifique los datos.')
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!editPaciente) return
    const validErr = validate(form)
    if (validErr) { setError(validErr); return }
    setSaving(true)
    setError('')
    try {
      await api.pacientes.update(editPaciente.id_Paciente, {
        dNI: form.dNI.trim(),
        nombre: form.nombre.trim(),
        nombre_2: form.nombre_2.trim() || undefined,
        apellido: form.apellido.trim(),
        apellido_2: form.apellido_2.trim() || undefined,
        telefono: form.telefono.trim(),
        correo: form.correo.trim(),
        sexo: form.sexo,
        fecha_Nacimiento: form.fecha_Nacimiento,
      })
      setEditPaciente(null)
      await loadData()
    } catch {
      setError('Error al actualizar el paciente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este paciente?')) return
    await api.pacientes.remove(id)
    await loadData()
  }

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--md-green-light)' }}>
            <i className="ti ti-user text-lg" style={{ color: 'var(--md-green-dark)' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>Gestión de Pacientes</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              Registro y administración de pacientes del sistema
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
        >
          <i className="ti ti-plus" /> Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-xl p-5" style={{ border: '2px solid #1b8a60' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>Listado de Pacientes</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              {filtered.length} paciente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative" style={{ maxWidth: 360 }}>
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o correo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit', width: 360 }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-sm py-4" style={{ color: 'var(--md-text-secondary)' }}>Cargando pacientes...</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: 'var(--md-text-secondary)' }}>
            No se encontraron pacientes
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                {['Paciente', 'DNI', 'Contacto', 'Sexo', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold pb-2 px-3" style={{ color: 'var(--md-text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id_Paciente} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                        style={{ background: 'var(--md-green-mid)' }}>
                        {p.persona.nombre[0]}{p.persona.apellido[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--md-text-primary)' }}>{fullName(p)}</div>
                        <div className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>
                          ID #{String(p.id_Paciente).padStart(3, '0')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: '#f0f0f0', color: '#555' }}>
                      {p.persona.dNI}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-xs" style={{ color: 'var(--md-text-primary)' }}>{p.persona.correo}</div>
                    <div className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>{p.persona.telefono}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2.5 py-0.5 rounded font-medium"
                      style={{ background: p.persona.sexo === 'M' ? '#e8f0fe' : '#fce4ec', color: p.persona.sexo === 'M' ? '#1a56db' : '#b71c50' }}>
                      {p.persona.sexo === 'M' ? 'Masculino' : p.persona.sexo === 'F' ? 'Femenino' : p.persona.sexo}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)}
                        className="text-gray-300 hover:text-gray-500 hover:bg-gray-100 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <i className="ti ti-pencil text-sm" />
                      </button>
                      <button onClick={() => handleDelete(p.id_Paciente)}
                        className="text-gray-300 hover:text-red-400 hover:bg-red-50 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nuevo Paciente" subtitle="Ingresa los datos del paciente">
        <PacienteFormFields form={form} saving={saving} error={error} submitLabel="Crear Paciente"
          onChange={setForm} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editPaciente} onClose={() => setEditPaciente(null)} title="Editar Paciente" subtitle="Modifica los datos del paciente">
        <PacienteFormFields form={form} saving={saving} error={error} submitLabel="Guardar cambios"
          onChange={setForm} onSubmit={handleEdit} onCancel={() => setEditPaciente(null)} />
      </Modal>
    </div>
  )
}

function PacienteFormFields({
  form, saving, error, submitLabel, onChange, onSubmit, onCancel,
}: {
  form: PacienteForm; saving: boolean; error: string; submitLabel: string
  onChange: (f: PacienteForm) => void; onSubmit: () => void; onCancel: () => void
}) {
  const inp = { border: '1px solid var(--md-border)', fontFamily: 'inherit', color: 'var(--md-text-primary)', background: '#fff' }
  const cls = 'w-full px-3 py-2 text-sm rounded-lg outline-none'
  const set = (k: keyof PacienteForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Nombre <span style={{ color: '#e05' }}>*</span></label>
          <input type="text" placeholder="Primer nombre" value={form.nombre} onChange={set('nombre')} className={cls} style={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Segundo nombre</label>
          <input type="text" placeholder="Opcional" value={form.nombre_2} onChange={set('nombre_2')} className={cls} style={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Apellido <span style={{ color: '#e05' }}>*</span></label>
          <input type="text" placeholder="Primer apellido" value={form.apellido} onChange={set('apellido')} className={cls} style={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Segundo apellido</label>
          <input type="text" placeholder="Opcional" value={form.apellido_2} onChange={set('apellido_2')} className={cls} style={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>DNI <span style={{ color: '#e05' }}>*</span></label>
          <input type="text" placeholder="Ej. 0801199012345" value={form.dNI} onChange={set('dNI')} className={cls} style={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Sexo</label>
          <select value={form.sexo} onChange={set('sexo')} className={cls} style={{ ...inp, cursor: 'pointer' }}>
            <option value="">Seleccionar...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Fecha de nacimiento</label>
          <input type="date" value={form.fecha_Nacimiento} onChange={set('fecha_Nacimiento')} className={cls} style={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Teléfono</label>
          <input type="tel" placeholder="+504 9999-9999" value={form.telefono} onChange={set('telefono')} className={cls} style={inp} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Correo electrónico</label>
          <input type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={set('correo')} className={cls} style={inp} />
        </div>
      </div>
      {error && (
        <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c' }}>
          {error}
        </div>
      )}
      <div className="flex gap-2.5 pt-1">
        <button onClick={onCancel} className="flex-1 py-2 text-sm rounded-lg hover:bg-gray-50"
          style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
          Cancelar
        </button>
        <button onClick={onSubmit} disabled={saving} className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </div>
  )
}
