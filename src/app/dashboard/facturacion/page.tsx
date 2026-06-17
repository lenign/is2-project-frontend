'use client'

import { useState, useEffect, useCallback } from 'react'
import Modal from '@/components/Modal'
import { api, FacturaDto, CitaDto } from '@/lib/api'

type FacturaForm = { cita_Id: number; monto: number | ''; metodo_Pago: string; estado: string }
const emptyForm: FacturaForm = { cita_Id: 0, monto: '', metodo_Pago: 'Efectivo', estado: 'Pendiente' }

const METODOS = ['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Cheque']
const ESTADOS = ['Pendiente', 'Pagado', 'Cancelado']

function estadoBadge(estado: string) {
  const map: Record<string, { bg: string; color: string }> = {
    Pagado:    { bg: '#e8f5ee', color: '#1b6e47' },
    Pendiente: { bg: '#fff8e1', color: '#92400e' },
    Cancelado: { bg: '#fff0f0', color: '#b91c1c' },
  }
  return map[estado] ?? { bg: '#f0f0f0', color: '#555' }
}

function formatFecha(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-HN', { year: 'numeric', month: 'short', day: '2-digit' })
}

function nombrePaciente(cita: CitaDto) {
  return `${cita.paciente.persona.nombre} ${cita.paciente.persona.apellido}`
}

function nombreDoctor(cita: CitaDto) {
  return `Dr. ${cita.doctor.persona.nombre} ${cita.doctor.persona.apellido}`
}

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState<FacturaDto[]>([])
  const [citas, setCitas] = useState<CitaDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [editFactura, setEditFactura] = useState<FacturaDto | null>(null)
  const [form, setForm] = useState<FacturaForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [f, c] = await Promise.all([api.facturas.list(), api.citas.list()])
      setFacturas(f)
      setCitas(c)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = facturas.filter(f => {
    const q = search.toLowerCase()
    const paciente = nombrePaciente(f.cita).toLowerCase()
    const doctor = nombreDoctor(f.cita).toLowerCase()
    const matchSearch = paciente.includes(q) || doctor.includes(q) || f.cita.paciente.persona.dNI.includes(q)
    const matchEstado = !estadoFilter || f.estado === estadoFilter
    return matchSearch && matchEstado
  })

  const totalPagado = filtered.filter(f => f.estado === 'Pagado').reduce((s, f) => s + f.monto, 0)
  const totalPendiente = filtered.filter(f => f.estado === 'Pendiente').reduce((s, f) => s + f.monto, 0)

  function validate(f: FacturaForm): string {
    if (!f.cita_Id) return 'Selecciona una cita.'
    if (!f.monto || Number(f.monto) <= 0) return 'El monto debe ser mayor a 0.'
    if (!f.metodo_Pago) return 'Selecciona un método de pago.'
    return ''
  }

  async function handleCreate() {
    const err = validate(form)
    if (err) { setError(err); return }
    setSaving(true); setError('')
    try {
      await api.facturas.create({
        cita_Id: form.cita_Id,
        monto: Number(form.monto),
        metodo_Pago: form.metodo_Pago,
        estado: form.estado,
      })
      setCreateOpen(false)
      await loadData()
    } catch { setError('Error al crear la factura.') }
    finally { setSaving(false) }
  }

  async function handleEdit() {
    if (!editFactura) return
    const err = validate(form)
    if (err) { setError(err); return }
    setSaving(true); setError('')
    try {
      await api.facturas.update(editFactura.id_Factura, {
        cita_Id: form.cita_Id,
        monto: Number(form.monto),
        metodo_Pago: form.metodo_Pago,
        estado: form.estado,
      })
      setEditFactura(null)
      await loadData()
    } catch { setError('Error al actualizar la factura.') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta factura?')) return
    await api.facturas.remove(id)
    await loadData()
  }

  function openCreate() {
    setError(''); setForm(emptyForm); setCreateOpen(true)
  }

  function openEdit(f: FacturaDto) {
    setError('')
    setForm({ cita_Id: f.cita_Id, monto: f.monto, metodo_Pago: f.metodo_Pago, estado: f.estado })
    setEditFactura(f)
  }

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--md-green-light)' }}>
            <i className="ti ti-receipt text-lg" style={{ color: 'var(--md-green-dark)' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>Facturación</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              Gestión de cobros por servicios médicos prestados
            </p>
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}>
          <i className="ti ti-plus" /> Nueva Factura
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total cobrado', value: `L. ${totalPagado.toFixed(2)}`, color: '#1b6e47', bg: '#e8f5ee', icon: 'ti-check' },
          { label: 'Por cobrar', value: `L. ${totalPendiente.toFixed(2)}`, color: '#92400e', bg: '#fff8e1', icon: 'ti-clock' },
          { label: 'Total facturas', value: String(filtered.length), color: 'var(--md-text-primary)', bg: '#f0f0f0', icon: 'ti-file-text' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 flex items-center gap-3" style={{ border: '1px solid var(--md-border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg }}>
              <i className={`ti ${s.icon} text-base`} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>{s.label}</div>
              <div className="text-lg font-semibold" style={{ color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl p-5" style={{ border: '2px solid #1b8a60' }}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative flex-1" style={{ maxWidth: 360 }}>
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input type="text" placeholder="Buscar por paciente, médico o DNI..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit' }} />
          </div>
          <select value={estadoFilter} onChange={e => setEstadoFilter(e.target.value)}
            className="text-sm rounded-lg px-3 py-2 outline-none"
            style={{ border: '1px solid var(--md-border)', background: '#fff', fontFamily: 'inherit', cursor: 'pointer' }}>
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-sm py-4" style={{ color: 'var(--md-text-secondary)' }}>Cargando facturas...</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: 'var(--md-text-secondary)' }}>No se encontraron facturas</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                {['#', 'Paciente', 'Médico', 'Monto', 'Método', 'Estado', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold pb-2 px-3" style={{ color: 'var(--md-text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const badge = estadoBadge(f.estado)
                return (
                  <tr key={f.id_Factura} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
                    <td className="px-3 py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: '#f0f0f0', color: '#555' }}>
                        #{String(f.id_Factura).padStart(3, '0')}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-sm font-medium" style={{ color: 'var(--md-text-primary)' }}>{nombrePaciente(f.cita)}</div>
                      <div className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>DNI: {f.cita.paciente.persona.dNI}</div>
                    </td>
                    <td className="text-sm px-3 py-2.5" style={{ color: 'var(--md-text-primary)' }}>{nombreDoctor(f.cita)}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>
                        L. {Number(f.monto).toFixed(2)}
                      </span>
                    </td>
                    <td className="text-xs px-3 py-2.5" style={{ color: 'var(--md-text-secondary)' }}>{f.metodo_Pago}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs px-2.5 py-0.5 rounded font-medium" style={{ background: badge.bg, color: badge.color }}>
                        {f.estado}
                      </span>
                    </td>
                    <td className="text-xs px-3 py-2.5" style={{ color: 'var(--md-text-secondary)' }}>{formatFecha(f.fecha_Creacion)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(f)}
                          className="text-gray-300 hover:text-gray-500 hover:bg-gray-100 p-1 rounded"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          <i className="ti ti-pencil text-sm" />
                        </button>
                        <button onClick={() => handleDelete(f.id_Factura)}
                          className="text-gray-300 hover:text-red-400 hover:bg-red-50 p-1 rounded"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          <i className="ti ti-trash text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nueva Factura" subtitle="Registra el cobro por una cita médica">
        <FacturaFormFields form={form} citas={citas} saving={saving} error={error}
          submitLabel="Crear Factura" onChange={setForm} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editFactura} onClose={() => setEditFactura(null)} title="Editar Factura" subtitle="Modifica los datos de la factura">
        <FacturaFormFields form={form} citas={citas} saving={saving} error={error}
          submitLabel="Guardar cambios" onChange={setForm} onSubmit={handleEdit} onCancel={() => setEditFactura(null)} />
      </Modal>
    </div>
  )
}

function FacturaFormFields({
  form, citas, saving, error, submitLabel, onChange, onSubmit, onCancel,
}: {
  form: FacturaForm; citas: CitaDto[]; saving: boolean; error: string; submitLabel: string
  onChange: (f: FacturaForm) => void; onSubmit: () => void; onCancel: () => void
}) {
  const inp = { border: '1px solid var(--md-border)', fontFamily: 'inherit', color: 'var(--md-text-primary)', background: '#fff' }
  const cls = 'w-full px-3 py-2 text-sm rounded-lg outline-none'

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Cita <span style={{ color: '#e05' }}>*</span></label>
        <select value={form.cita_Id} onChange={e => onChange({ ...form, cita_Id: Number(e.target.value) })}
          className={cls} style={{ ...inp, cursor: 'pointer' }}>
          <option value={0}>Seleccionar cita...</option>
          {citas.map(c => (
            <option key={c.id_Cita} value={c.id_Cita}>
              #{String(c.id_Cita).padStart(3, '0')} — {c.paciente.persona.nombre} {c.paciente.persona.apellido} / Dr. {c.doctor.persona.apellido} ({new Date(c.fecha_Cita).toLocaleDateString('es-HN')})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Monto (L.) <span style={{ color: '#e05' }}>*</span></label>
          <input type="number" min="0.01" step="0.01" placeholder="0.00"
            value={form.monto} onChange={e => onChange({ ...form, monto: e.target.value === '' ? '' : Number(e.target.value) })}
            className={cls} style={{ ...inp, border: '1.5px solid var(--md-green-dark)' }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Método de pago <span style={{ color: '#e05' }}>*</span></label>
          <select value={form.metodo_Pago} onChange={e => onChange({ ...form, metodo_Pago: e.target.value })}
            className={cls} style={{ ...inp, cursor: 'pointer' }}>
            {['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Cheque'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Estado</label>
        <select value={form.estado} onChange={e => onChange({ ...form, estado: e.target.value })}
          className={cls} style={{ ...inp, cursor: 'pointer' }}>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      {error && (
        <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c' }}>
          {error}
        </div>
      )}
      <div className="flex gap-2.5 pt-1">
        <button onClick={onCancel} className="flex-1 py-2 text-sm rounded-lg"
          style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
        <button onClick={onSubmit} disabled={saving} className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </div>
  )
}
