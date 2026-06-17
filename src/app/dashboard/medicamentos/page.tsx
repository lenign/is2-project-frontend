'use client'

import { useState, useEffect, useCallback } from 'react'
import Modal from '@/components/Modal'
import { api, MedicamentoDto, TipoMedicamentoDto } from '@/lib/api'

type MedForm = { descripcion: string; tipo_Medicamento_Id: number }
type TipoForm = { descripcion: string }

const emptyMed: MedForm = { descripcion: '', tipo_Medicamento_Id: 0 }
const emptyTipo: TipoForm = { descripcion: '' }

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState<MedicamentoDto[]>([])
  const [tipos, setTipos] = useState<TipoMedicamentoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState(0)

  const [createMedOpen, setCreateMedOpen] = useState(false)
  const [editMed, setEditMed] = useState<MedicamentoDto | null>(null)
  const [medForm, setMedForm] = useState<MedForm>(emptyMed)
  const [savingMed, setSavingMed] = useState(false)
  const [medError, setMedError] = useState('')

  const [createTipoOpen, setCreateTipoOpen] = useState(false)
  const [editTipo, setEditTipo] = useState<TipoMedicamentoDto | null>(null)
  const [tipoForm, setTipoForm] = useState<TipoForm>(emptyTipo)
  const [savingTipo, setSavingTipo] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [meds, tiposData] = await Promise.all([api.medicamentos.list(), api.tiposMedicamento.list()])
      setMedicamentos(meds)
      setTipos(tiposData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = medicamentos.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = m.descripcion.toLowerCase().includes(q) || m.tipo_Nombre.toLowerCase().includes(q)
    const matchTipo = tipoFilter === 0 || m.tipo_Medicamento_Id === tipoFilter
    return matchSearch && matchTipo
  })

  // -- Medicamento handlers --
  function validateMed(f: MedForm): string {
    if (!f.descripcion.trim() || f.descripcion.trim().length < 3) return 'La descripción debe tener al menos 3 caracteres.'
    if (!f.tipo_Medicamento_Id) return 'Selecciona un tipo de medicamento.'
    return ''
  }

  async function handleCreateMed() {
    const err = validateMed(medForm)
    if (err) { setMedError(err); return }
    setSavingMed(true); setMedError('')
    try {
      await api.medicamentos.create({ descripcion: medForm.descripcion.trim(), tipo_Medicamento_Id: medForm.tipo_Medicamento_Id })
      setCreateMedOpen(false)
      await loadData()
    } catch { setMedError('Error al crear el medicamento.') }
    finally { setSavingMed(false) }
  }

  async function handleEditMed() {
    if (!editMed) return
    const err = validateMed(medForm)
    if (err) { setMedError(err); return }
    setSavingMed(true); setMedError('')
    try {
      await api.medicamentos.update(editMed.id_Medicamento, { descripcion: medForm.descripcion.trim(), tipo_Medicamento_Id: medForm.tipo_Medicamento_Id })
      setEditMed(null)
      await loadData()
    } catch { setMedError('Error al actualizar el medicamento.') }
    finally { setSavingMed(false) }
  }

  async function handleDeleteMed(id: number) {
    if (!confirm('¿Eliminar este medicamento?')) return
    await api.medicamentos.remove(id)
    await loadData()
  }

  // -- Tipo handlers --
  async function handleCreateTipo() {
    if (!tipoForm.descripcion.trim()) return
    setSavingTipo(true)
    try {
      await api.tiposMedicamento.create(tipoForm.descripcion.trim())
      setCreateTipoOpen(false); setTipoForm(emptyTipo)
      await loadData()
    } finally { setSavingTipo(false) }
  }

  async function handleEditTipo() {
    if (!editTipo || !tipoForm.descripcion.trim()) return
    setSavingTipo(true)
    try {
      await api.tiposMedicamento.update(editTipo.id_Tipo, tipoForm.descripcion.trim())
      setEditTipo(null)
      await loadData()
    } finally { setSavingTipo(false) }
  }

  async function handleDeleteTipo(id: number) {
    if (!confirm('¿Eliminar este tipo de medicamento?')) return
    await api.tiposMedicamento.remove(id)
    await loadData()
  }

  const inp = { border: '1px solid var(--md-border)', fontFamily: 'inherit', color: 'var(--md-text-primary)', background: '#fff' }
  const cls = 'w-full px-3 py-2 text-sm rounded-lg outline-none'

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--md-green-light)' }}>
            <i className="ti ti-pill text-lg" style={{ color: 'var(--md-green-dark)' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>Catálogo de Medicamentos</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              Gestión del catálogo de medicamentos y sus tipos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setTipoForm(emptyTipo); setCreateTipoOpen(true) }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
            style={{ border: '1.5px solid var(--md-green-dark)', color: 'var(--md-green-dark)', background: '#fff', cursor: 'pointer' }}
          >
            <i className="ti ti-tag" /> Nuevo Tipo
          </button>
          <button
            onClick={() => { setMedForm(emptyMed); setMedError(''); setCreateMedOpen(true) }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
          >
            <i className="ti ti-plus" /> Nuevo Medicamento
          </button>
        </div>
      </div>

      {/* Tipos de medicamento */}
      <div className="bg-white rounded-xl p-4 mb-5" style={{ border: '1px solid var(--md-border)' }}>
        <div className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: 'var(--md-text-secondary)' }}>
          Tipos de Medicamento
        </div>
        <div className="flex flex-wrap gap-2">
          {tipos.map(t => (
            <div key={t.id_Tipo} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: '#e8f5ee', color: '#1b6e47' }}>
              {t.descripcion}
              <button onClick={() => { setEditTipo(t); setTipoForm({ descripcion: t.descripcion }) }}
                className="hover:opacity-70" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <i className="ti ti-pencil text-xs" />
              </button>
              <button onClick={() => handleDeleteTipo(t.id_Tipo)}
                className="hover:opacity-70" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#b91c1c' }}>
                <i className="ti ti-x text-xs" />
              </button>
            </div>
          ))}
          {tipos.length === 0 && (
            <span className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>No hay tipos registrados</span>
          )}
        </div>
      </div>

      {/* Tabla de medicamentos */}
      <div className="bg-white rounded-xl p-5" style={{ border: '2px solid #1b8a60' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>Medicamentos</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              {filtered.length} medicamento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative" style={{ maxWidth: 320 }}>
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text"
              placeholder="Buscar medicamento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit', width: 320 }}
            />
          </div>
          <select
            value={tipoFilter}
            onChange={e => setTipoFilter(Number(e.target.value))}
            className="text-sm rounded-lg px-3 py-2 outline-none"
            style={{ border: '1px solid var(--md-border)', background: '#fff', fontFamily: 'inherit', cursor: 'pointer' }}
          >
            <option value={0}>Todos los tipos</option>
            {tipos.map(t => <option key={t.id_Tipo} value={t.id_Tipo}>{t.descripcion}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-sm py-4" style={{ color: 'var(--md-text-secondary)' }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm py-8 text-center" style={{ color: 'var(--md-text-secondary)' }}>No se encontraron medicamentos</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                {['ID', 'Medicamento', 'Tipo', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold pb-2 px-3" style={{ color: 'var(--md-text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id_Medicamento} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: '#f0f0f0', color: '#555' }}>
                      #{String(m.id_Medicamento).padStart(3, '0')}
                    </span>
                  </td>
                  <td className="text-sm px-3 py-2.5 font-medium" style={{ color: 'var(--md-text-primary)' }}>{m.descripcion}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2.5 py-0.5 rounded font-medium" style={{ background: '#e8f5ee', color: '#1b6e47' }}>
                      {m.tipo_Nombre || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditMed(m); setMedForm({ descripcion: m.descripcion, tipo_Medicamento_Id: m.tipo_Medicamento_Id }); setMedError('') }}
                        className="text-gray-300 hover:text-gray-500 hover:bg-gray-100 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <i className="ti ti-pencil text-sm" />
                      </button>
                      <button onClick={() => handleDeleteMed(m.id_Medicamento)}
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

      {/* Modal crear medicamento */}
      <Modal open={createMedOpen} onClose={() => setCreateMedOpen(false)} title="Nuevo Medicamento" subtitle="Agrega un medicamento al catálogo">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Descripción / Nombre <span style={{ color: '#e05' }}>*</span></label>
            <input type="text" placeholder="Ej. Paracetamol 500mg" value={medForm.descripcion}
              onChange={e => setMedForm({ ...medForm, descripcion: e.target.value })}
              className={cls} style={{ ...inp, border: '1.5px solid var(--md-green-dark)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Tipo <span style={{ color: '#e05' }}>*</span></label>
            <select value={medForm.tipo_Medicamento_Id} onChange={e => setMedForm({ ...medForm, tipo_Medicamento_Id: Number(e.target.value) })}
              className={cls} style={{ ...inp, cursor: 'pointer' }}>
              <option value={0}>Seleccionar tipo...</option>
              {tipos.map(t => <option key={t.id_Tipo} value={t.id_Tipo}>{t.descripcion}</option>)}
            </select>
          </div>
          {medError && <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c' }}>{medError}</div>}
          <div className="flex gap-2.5 pt-1">
            <button onClick={() => setCreateMedOpen(false)} className="flex-1 py-2 text-sm rounded-lg"
              style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
            <button onClick={handleCreateMed} disabled={savingMed} className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: savingMed ? 0.6 : 1 }}>
              {savingMed ? 'Guardando...' : 'Crear Medicamento'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal editar medicamento */}
      <Modal open={!!editMed} onClose={() => setEditMed(null)} title="Editar Medicamento" subtitle="Modifica el medicamento">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Descripción / Nombre <span style={{ color: '#e05' }}>*</span></label>
            <input type="text" value={medForm.descripcion} onChange={e => setMedForm({ ...medForm, descripcion: e.target.value })}
              className={cls} style={{ ...inp, border: '1.5px solid var(--md-green-dark)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Tipo <span style={{ color: '#e05' }}>*</span></label>
            <select value={medForm.tipo_Medicamento_Id} onChange={e => setMedForm({ ...medForm, tipo_Medicamento_Id: Number(e.target.value) })}
              className={cls} style={{ ...inp, cursor: 'pointer' }}>
              <option value={0}>Seleccionar tipo...</option>
              {tipos.map(t => <option key={t.id_Tipo} value={t.id_Tipo}>{t.descripcion}</option>)}
            </select>
          </div>
          {medError && <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c' }}>{medError}</div>}
          <div className="flex gap-2.5 pt-1">
            <button onClick={() => setEditMed(null)} className="flex-1 py-2 text-sm rounded-lg"
              style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
            <button onClick={handleEditMed} disabled={savingMed} className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: savingMed ? 0.6 : 1 }}>
              {savingMed ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal crear tipo */}
      <Modal open={createTipoOpen} onClose={() => setCreateTipoOpen(false)} title="Nuevo Tipo de Medicamento" subtitle="Agrega una categoría">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Nombre del tipo <span style={{ color: '#e05' }}>*</span></label>
            <input type="text" placeholder="Ej. Analgésico, Antibiótico..." value={tipoForm.descripcion}
              onChange={e => setTipoForm({ descripcion: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleCreateTipo()}
              className={cls} style={{ ...inp, border: '1.5px solid var(--md-green-dark)' }} />
          </div>
          <div className="flex gap-2.5 pt-1">
            <button onClick={() => setCreateTipoOpen(false)} className="flex-1 py-2 text-sm rounded-lg"
              style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
            <button onClick={handleCreateTipo} disabled={savingTipo} className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: savingTipo ? 0.6 : 1 }}>
              {savingTipo ? 'Guardando...' : 'Crear Tipo'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal editar tipo */}
      <Modal open={!!editTipo} onClose={() => setEditTipo(null)} title="Editar Tipo" subtitle="Modifica el tipo de medicamento">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Nombre del tipo <span style={{ color: '#e05' }}>*</span></label>
            <input type="text" value={tipoForm.descripcion} onChange={e => setTipoForm({ descripcion: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleEditTipo()}
              className={cls} style={{ ...inp, border: '1.5px solid var(--md-green-dark)' }} />
          </div>
          <div className="flex gap-2.5 pt-1">
            <button onClick={() => setEditTipo(null)} className="flex-1 py-2 text-sm rounded-lg"
              style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
            <button onClick={handleEditTipo} disabled={savingTipo} className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: savingTipo ? 0.6 : 1 }}>
              {savingTipo ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
