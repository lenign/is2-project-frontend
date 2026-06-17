'use client'

import { useState, useCallback } from 'react'
import Modal from '@/components/Modal'
import { api, DiagnosticoDto, CitaDto } from '@/lib/api'

type DiagnosticoForm = { descripcion: string; comentario: string; cita_Id: number }

const emptyForm: DiagnosticoForm = { descripcion: '', comentario: '', cita_Id: 0 }

function formatFecha(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-HN', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function DiagnosticosPage() {
  const [dni, setDni] = useState('')
  const [searching, setSearching] = useState(false)
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoDto[] | null>(null)
  const [citas, setCitas] = useState<CitaDto[]>([])
  const [searchError, setSearchError] = useState('')
  const [pacienteInfo, setPacienteInfo] = useState<{ nombre: string; dNI: string } | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editDiag, setEditDiag] = useState<DiagnosticoDto | null>(null)
  const [form, setForm] = useState<DiagnosticoForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const buscarPorDni = useCallback(async () => {
    if (!dni.trim()) return
    setSearching(true)
    setSearchError('')
    setDiagnosticos(null)
    setCitas([])
    setPacienteInfo(null)
    try {
      const [diags, paciente] = await Promise.all([
        api.diagnosticos.byDni(dni.trim()),
        api.pacientes.byDni(dni.trim()),
      ])
      setDiagnosticos(diags)
      setPacienteInfo({
        nombre: [paciente.persona.nombre, paciente.persona.apellido].filter(Boolean).join(' '),
        dNI: paciente.persona.dNI,
      })
      const citasPaciente = await api.citas.byPaciente(paciente.id_Paciente)
      setCitas(citasPaciente)
    } catch {
      setSearchError('No se encontró ningún paciente con ese DNI.')
    } finally {
      setSearching(false)
    }
  }, [dni])

  function openCreate() {
    setFormError('')
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEdit(d: DiagnosticoDto) {
    setFormError('')
    setForm({ descripcion: d.descripcion, comentario: d.comentario ?? '', cita_Id: d.cita?.id_Cita ?? 0 })
    setEditDiag(d)
  }

  async function handleCreate() {
    if (!form.descripcion.trim() || !form.cita_Id) return
    setSaving(true)
    setFormError('')
    try {
      await api.diagnosticos.create({
        descripcion: form.descripcion.trim(),
        comentario: form.comentario.trim() || undefined,
        cita_Id: form.cita_Id,
      })
      setCreateOpen(false)
      await buscarPorDni()
    } catch {
      setFormError('Error al crear el diagnóstico.')
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!editDiag || !form.descripcion.trim() || !form.cita_Id) return
    setSaving(true)
    setFormError('')
    try {
      await api.diagnosticos.update(editDiag.id_Diagnostico, {
        descripcion: form.descripcion.trim(),
        comentario: form.comentario.trim() || undefined,
        cita_Id: form.cita_Id,
      })
      setEditDiag(null)
      await buscarPorDni()
    } catch {
      setFormError('Error al actualizar el diagnóstico.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este diagnóstico?')) return
    await api.diagnosticos.remove(id)
    await buscarPorDni()
  }

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--md-green-light)' }}>
          <i className="ti ti-stethoscope text-lg" style={{ color: 'var(--md-green-dark)' }} />
        </div>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>Diagnósticos</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
            Consulta y gestión de diagnósticos médicos por paciente
          </p>
        </div>
      </div>

      {/* Búsqueda por DNI */}
      <div className="bg-white rounded-xl p-5 mb-5" style={{ border: '2px solid #1b8a60' }}>
        <div className="text-sm font-semibold mb-1" style={{ color: 'var(--md-text-primary)' }}>Buscar Paciente por DNI</div>
        <div className="text-xs mb-3" style={{ color: 'var(--md-text-secondary)' }}>
          Ingresa el DNI del paciente para ver sus diagnósticos
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1" style={{ maxWidth: 400 }}>
            <i className="ti ti-id-badge absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text"
              placeholder="Ej. 0801199012345"
              value={dni}
              onChange={e => setDni(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarPorDni()}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none"
              style={{ border: '1.5px solid var(--md-green-dark)', fontFamily: 'inherit' }}
            />
          </div>
          <button
            onClick={buscarPorDni}
            disabled={searching || !dni.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white rounded-lg"
            style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', opacity: searching || !dni.trim() ? 0.6 : 1 }}
          >
            <i className={`ti ${searching ? 'ti-loader-2' : 'ti-search'}`} />
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {searchError && (
          <div className="mt-3 px-3 py-2 rounded-lg text-xs" style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c' }}>
            <i className="ti ti-alert-circle mr-1" />{searchError}
          </div>
        )}
      </div>

      {/* Resultados */}
      {diagnosticos !== null && (
        <div className="bg-white rounded-xl p-5" style={{ border: '2px solid #1b8a60' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              {pacienteInfo && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'var(--md-green-mid)' }}>
                    {pacienteInfo.nombre[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>{pacienteInfo.nombre}</div>
                    <div className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>DNI: {pacienteInfo.dNI}</div>
                  </div>
                </div>
              )}
              <div className="text-xs mt-1" style={{ color: 'var(--md-text-secondary)' }}>
                {diagnosticos.length} diagnóstico{diagnosticos.length !== 1 ? 's' : ''} registrado{diagnosticos.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={openCreate}
              disabled={citas.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: citas.length === 0 ? 'not-allowed' : 'pointer', opacity: citas.length === 0 ? 0.5 : 1 }}
              title={citas.length === 0 ? 'El paciente no tiene citas registradas' : 'Nuevo diagnóstico'}
            >
              <i className="ti ti-plus" /> Nuevo Diagnóstico
            </button>
          </div>

          {diagnosticos.length === 0 ? (
            <div className="py-10 text-center">
              <i className="ti ti-clipboard-text text-3xl mb-2 block" style={{ color: '#ccc' }} />
              <div className="text-sm" style={{ color: 'var(--md-text-secondary)' }}>Este paciente no tiene diagnósticos registrados</div>
            </div>
          ) : (
            <div className="space-y-3">
              {diagnosticos.map(d => (
                <div key={d.id_Diagnostico} className="rounded-lg p-4" style={{ border: '1px solid #eee', background: '#fafafa' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: '#f0f0f0', color: '#555' }}>
                          #{String(d.id_Diagnostico).padStart(3, '0')}
                        </span>
                        {d.cita && (
                          <span className="text-xs px-2.5 py-0.5 rounded font-medium" style={{ background: '#e8f5ee', color: '#1b6e47' }}>
                            Cita #{String(d.cita.id_Cita).padStart(3, '0')} — {formatFecha(d.cita.fecha_Cita)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--md-text-primary)' }}>{d.descripcion}</div>
                      {d.comentario && (
                        <div className="text-xs p-2.5 rounded-md" style={{ background: '#fff', border: '1px solid #eee', color: 'var(--md-text-secondary)' }}>
                          <i className="ti ti-notes mr-1" />{d.comentario}
                        </div>
                      )}
                      {d.cita?.doctor && (
                        <div className="mt-2 text-xs" style={{ color: 'var(--md-text-secondary)' }}>
                          <i className="ti ti-stethoscope mr-1" />
                          Dr. {d.cita.doctor.persona.nombre} {d.cita.doctor.persona.apellido}
                          {d.cita.doctor.especialidad?.descripcion && ` — ${d.cita.doctor.especialidad.descripcion}`}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(d)}
                        className="text-gray-300 hover:text-gray-500 hover:bg-gray-100 p-1.5 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <i className="ti ti-pencil text-sm" />
                      </button>
                      <button onClick={() => handleDelete(d.id_Diagnostico)}
                        className="text-gray-300 hover:text-red-400 hover:bg-red-50 p-1.5 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <i className="ti ti-trash text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal crear */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nuevo Diagnóstico" subtitle="Registra un diagnóstico para el paciente">
        <DiagnosticoFormFields form={form} citas={citas} saving={saving} error={formError}
          submitLabel="Crear Diagnóstico" onChange={setForm} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Modal editar */}
      <Modal open={!!editDiag} onClose={() => setEditDiag(null)} title="Editar Diagnóstico" subtitle="Modifica el diagnóstico">
        <DiagnosticoFormFields form={form} citas={citas} saving={saving} error={formError}
          submitLabel="Guardar cambios" onChange={setForm} onSubmit={handleEdit} onCancel={() => setEditDiag(null)} />
      </Modal>
    </div>
  )
}

function DiagnosticoFormFields({
  form, citas, saving, error, submitLabel, onChange, onSubmit, onCancel,
}: {
  form: DiagnosticoForm; citas: CitaDto[]; saving: boolean; error: string; submitLabel: string
  onChange: (f: DiagnosticoForm) => void; onSubmit: () => void; onCancel: () => void
}) {
  const inp = { border: '1px solid var(--md-border)', fontFamily: 'inherit', color: 'var(--md-text-primary)', background: '#fff' }
  const cls = 'w-full px-3 py-2 text-sm rounded-lg outline-none'

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
          Cita asociada <span style={{ color: '#e05' }}>*</span>
        </label>
        <select value={form.cita_Id} onChange={e => onChange({ ...form, cita_Id: Number(e.target.value) })}
          className={cls} style={{ ...inp, cursor: 'pointer' }}>
          <option value={0}>Seleccionar cita...</option>
          {citas.map(c => (
            <option key={c.id_Cita} value={c.id_Cita}>
              Cita #{String(c.id_Cita).padStart(3, '0')} — Dr. {c.doctor.persona.nombre} {c.doctor.persona.apellido} ({new Date(c.fecha_Cita).toLocaleDateString('es-HN')})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
          Descripción <span style={{ color: '#e05' }}>*</span>
        </label>
        <input type="text" placeholder="Descripción del diagnóstico (mínimo 5 caracteres)"
          value={form.descripcion} onChange={e => onChange({ ...form, descripcion: e.target.value })}
          className={cls} style={{ ...inp, border: '1.5px solid var(--md-green-dark)' }} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
          Comentario / Observaciones
        </label>
        <textarea
          placeholder="Observaciones adicionales, tratamiento recomendado, etc."
          value={form.comentario}
          onChange={e => onChange({ ...form, comentario: e.target.value })}
          rows={3}
          className={cls}
          style={{ ...inp, resize: 'none' }}
        />
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
