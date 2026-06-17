'use client'

import { useState, useEffect, useCallback } from 'react'
import Modal from '@/components/Modal'
import { api, CitaDto, PacienteDto, DoctorDto } from '@/lib/api'

type CitaForm = { paciente_Id: number; doctor_Id: number; fecha_Cita: string }

const emptyForm: CitaForm = { paciente_Id: 0, doctor_Id: 0, fecha_Cita: '' }

function nombrePaciente(p: PacienteDto) {
  return [p.persona.nombre, p.persona.apellido].filter(Boolean).join(' ')
}

function nombreDoctor(d: DoctorDto) {
  return [d.persona.nombre, d.persona.apellido].filter(Boolean).join(' ')
}

function formatFecha(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-HN', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function CitasPage() {
  const [citas, setCitas] = useState<CitaDto[]>([])
  const [pacientes, setPacientes] = useState<PacienteDto[]>([])
  const [doctores, setDoctores] = useState<DoctorDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editCita, setEditCita] = useState<CitaDto | null>(null)
  const [form, setForm] = useState<CitaForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [c, p, d] = await Promise.all([api.citas.list(), api.pacientes.list(), api.doctores.list()])
      setCitas(c)
      setPacientes(p)
      setDoctores(d)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = citas.filter(c => {
    const q = search.toLowerCase()
    const np = nombrePaciente(c.paciente).toLowerCase()
    const nd = nombreDoctor(c.doctor).toLowerCase()
    return np.includes(q) || nd.includes(q) || c.paciente.persona.dNI.includes(q)
  })

  function openCreate() {
    setError('')
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEdit(c: CitaDto) {
    setError('')
    setForm({
      paciente_Id: c.paciente.id_Paciente,
      doctor_Id: c.doctor.id_Doctor,
      fecha_Cita: c.fecha_Cita?.slice(0, 16) ?? '',
    })
    setEditCita(c)
  }

  async function handleCreate() {
    if (!form.paciente_Id || !form.doctor_Id || !form.fecha_Cita) return
    setSaving(true)
    setError('')
    try {
      await api.citas.create(form)
      setCreateOpen(false)
      await loadData()
    } catch {
      setError('Error al crear la cita. Verifique los datos.')
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!editCita || !form.paciente_Id || !form.doctor_Id || !form.fecha_Cita) return
    setSaving(true)
    setError('')
    try {
      await api.citas.update(editCita.id_Cita, form)
      setEditCita(null)
      await loadData()
    } catch {
      setError('Error al actualizar la cita.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta cita?')) return
    await api.citas.remove(id)
    await loadData()
  }

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--md-green-light)' }}>
            <i className="ti ti-calendar text-lg" style={{ color: 'var(--md-green-dark)' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>Gestión de Citas</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              Programación y administración de citas médicas
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
        >
          <i className="ti ti-plus" /> Nueva Cita
        </button>
      </div>

      <div className="bg-white rounded-xl p-5" style={{ border: '2px solid #1b8a60' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>Citas Programadas</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              {filtered.length} cita{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative" style={{ maxWidth: 380 }}>
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text"
              placeholder="Buscar por paciente, médico o DNI..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit', width: 380 }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-sm py-4" style={{ color: 'var(--md-text-secondary)' }}>Cargando citas...</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: 'var(--md-text-secondary)' }}>
            No se encontraron citas
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                {['ID', 'Paciente', 'Médico', 'Especialidad', 'Fecha de Cita', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold pb-2 px-3" style={{ color: 'var(--md-text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id_Cita} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: '#f0f0f0', color: '#555' }}>
                      #{String(c.id_Cita).padStart(3, '0')}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-sm font-medium" style={{ color: 'var(--md-text-primary)' }}>{nombrePaciente(c.paciente)}</div>
                    <div className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>DNI: {c.paciente.persona.dNI}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-sm" style={{ color: 'var(--md-text-primary)' }}>Dr. {nombreDoctor(c.doctor)}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2.5 py-0.5 rounded font-medium" style={{ background: '#e8f5ee', color: '#1b6e47' }}>
                      {c.doctor.especialidad?.descripcion ?? '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-sm" style={{ color: 'var(--md-text-primary)' }}>{formatFecha(c.fecha_Cita)}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)}
                        className="text-gray-300 hover:text-gray-500 hover:bg-gray-100 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <i className="ti ti-pencil text-sm" />
                      </button>
                      <button onClick={() => handleDelete(c.id_Cita)}
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nueva Cita" subtitle="Programa una cita médica">
        <CitaFormFields form={form} pacientes={pacientes} doctores={doctores} saving={saving} error={error}
          submitLabel="Crear Cita" onChange={setForm} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editCita} onClose={() => setEditCita(null)} title="Editar Cita" subtitle="Modifica los datos de la cita">
        <CitaFormFields form={form} pacientes={pacientes} doctores={doctores} saving={saving} error={error}
          submitLabel="Guardar cambios" onChange={setForm} onSubmit={handleEdit} onCancel={() => setEditCita(null)} />
      </Modal>
    </div>
  )
}

function CitaFormFields({
  form, pacientes, doctores, saving, error, submitLabel, onChange, onSubmit, onCancel,
}: {
  form: CitaForm; pacientes: PacienteDto[]; doctores: DoctorDto[]
  saving: boolean; error: string; submitLabel: string
  onChange: (f: CitaForm) => void; onSubmit: () => void; onCancel: () => void
}) {
  const inp = { border: '1px solid var(--md-border)', fontFamily: 'inherit', color: 'var(--md-text-primary)', background: '#fff' }
  const cls = 'w-full px-3 py-2 text-sm rounded-lg outline-none'

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Paciente <span style={{ color: '#e05' }}>*</span></label>
        <select value={form.paciente_Id} onChange={e => onChange({ ...form, paciente_Id: Number(e.target.value) })}
          className={cls} style={{ ...inp, cursor: 'pointer' }}>
          <option value={0}>Seleccionar paciente...</option>
          {pacientes.map(p => (
            <option key={p.id_Paciente} value={p.id_Paciente}>
              {p.persona.nombre} {p.persona.apellido} — {p.persona.dNI}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Médico <span style={{ color: '#e05' }}>*</span></label>
        <select value={form.doctor_Id} onChange={e => onChange({ ...form, doctor_Id: Number(e.target.value) })}
          className={cls} style={{ ...inp, cursor: 'pointer' }}>
          <option value={0}>Seleccionar médico...</option>
          {doctores.map(d => (
            <option key={d.id_Doctor} value={d.id_Doctor}>
              Dr. {d.persona.nombre} {d.persona.apellido} — {d.especialidad?.descripcion}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Fecha y hora <span style={{ color: '#e05' }}>*</span></label>
        <input type="datetime-local" value={form.fecha_Cita} onChange={e => onChange({ ...form, fecha_Cita: e.target.value })}
          className={cls} style={inp} />
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
