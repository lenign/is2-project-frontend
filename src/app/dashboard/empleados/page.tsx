'use client'

import { useState, useEffect } from 'react'
import Stepper from '@/components/Stepper'
import { api, HospitalDto, RolDto, TipoEmpleadoDto } from '@/lib/api'

const STEPS = [{ label: 'Datos personales' }, { label: 'Datos del empleado' }]

interface PersonaForm {
  nombre: string
  apellido: string
  dni: string
  correo: string
  telefono: string
}

interface EmpleadoForm {
  password: string
  hospital_id: string
  rol_id: string
  tipo_empleado_id: string
}

const emptyPersona: PersonaForm = { nombre: '', apellido: '', dni: '', correo: '', telefono: '' }
const emptyEmpleado: EmpleadoForm = { password: '', hospital_id: '', rol_id: '', tipo_empleado_id: '' }

export default function EmpleadosPage() {
  const [step, setStep] = useState(0)
  const [persona, setPersona] = useState<PersonaForm>(emptyPersona)
  const [empleado, setEmpleado] = useState<EmpleadoForm>(emptyEmpleado)
  const [hospitales, setHospitales] = useState<HospitalDto[]>([])
  const [roles, setRoles] = useState<RolDto[]>([])
  const [tiposEmpleado, setTiposEmpleado] = useState<TipoEmpleadoDto[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([api.hospitales.list(), api.roles.list(), api.tiposEmpleado.list()])
      .then(([hosp, rols, tipos]) => {
        setHospitales(hosp)
        setRoles(rols)
        setTiposEmpleado(tipos)
      })
      .catch(() => setLoadError('Error al cargar datos del formulario'))
  }, [])

  const handleSave = async () => {
    setSaveError('')
    setLoading(true)
    try {
      await api.empleados.create({
        password: empleado.password,
        hospital_Id: Number(empleado.hospital_id),
        rol_Id: Number(empleado.rol_id),
        tipo_Empleado_Id: Number(empleado.tipo_empleado_id),
      })
      setSaved(true)
      setPersona(emptyPersona)
      setEmpleado(emptyEmpleado)
      setStep(0)
    } catch {
      setSaveError('Error al guardar el empleado. Verifique los datos e intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const setP = (field: keyof PersonaForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersona(prev => ({ ...prev, [field]: e.target.value }))

  const setE = (field: keyof EmpleadoForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEmpleado(prev => ({ ...prev, [field]: e.target.value }))

  const inputClass = 'w-full px-3 py-2.5 text-sm rounded-lg outline-none'
  const inputStyle = {
    border: '1px solid var(--md-border)',
    fontFamily: 'inherit',
    color: 'var(--md-text-primary)',
    background: '#fff',
  }

  return (
    <div className="p-7">
      <div className="bg-white rounded-xl p-8 max-w-2xl" style={{ border: '0.5px solid var(--md-border)' }}>
        <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--md-text-primary)' }}>
          Registro de Empleado
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--md-text-secondary)' }}>
          Complete los datos para registrar personal administrativo.
        </p>

        <Stepper steps={STEPS} current={step} />

        {loadError && (
          <div className="mb-4 px-3 py-2.5 rounded-lg text-sm" style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c' }}>
            {loadError}
          </div>
        )}

        {saved && (
          <div className="mb-4 px-3 py-2.5 rounded-lg text-sm" style={{ background: 'var(--md-green-light)', border: '1px solid var(--md-green-border)', color: 'var(--md-green-dark)' }}>
            <i className="ti ti-circle-check" /> Empleado registrado correctamente.
          </div>
        )}

        {step === 0 && (
          <>
            <div className="text-[10px] font-semibold tracking-widest uppercase mb-2.5" style={{ color: 'var(--md-text-secondary)' }}>
              Identificación
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Nombre completo <span style={{ color: '#e05' }}>*</span></label>
                <input type="text" placeholder="Nombre(s)" value={persona.nombre} onChange={setP('nombre')} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Apellidos <span style={{ color: '#e05' }}>*</span></label>
                <input type="text" placeholder="Apellidos" value={persona.apellido} onChange={setP('apellido')} className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>DNI <span style={{ color: '#e05' }}>*</span></label>
                <input type="text" placeholder="Ej. 12345678" value={persona.dni} onChange={setP('dni')} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Teléfono</label>
                <input type="tel" placeholder="+504 9999-9999" value={persona.telefono} onChange={setP('telefono')} className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Correo electrónico</label>
              <input type="email" placeholder="correo@ejemplo.com" value={persona.correo} onChange={setP('correo')} className={inputClass} style={inputStyle} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-5 text-sm" style={{ background: 'var(--md-green-light)', border: '1px solid var(--md-green-border)', color: 'var(--md-green-dark)' }}>
              <i className="ti ti-circle-check" /> Persona vinculada: {persona.nombre} {persona.apellido}
            </div>

            <div className="text-[10px] font-semibold tracking-widest uppercase mb-2.5" style={{ color: 'var(--md-text-secondary)' }}>
              Credenciales
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Contraseña <span style={{ color: '#e05' }}>*</span></label>
              <input type="password" placeholder="Mínimo 8 caracteres" value={empleado.password} onChange={setE('password')} className={inputClass} style={{ ...inputStyle, maxWidth: '50%' }} />
            </div>

            <div className="text-[10px] font-semibold tracking-widest uppercase mb-2.5" style={{ color: 'var(--md-text-secondary)' }}>
              Asignación institucional
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Hospital <span style={{ color: '#e05' }}>*</span></label>
                <select value={empleado.hospital_id} onChange={setE('hospital_id')} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Seleccionar...</option>
                  {hospitales.map(h => (
                    <option key={h.id_Hospital} value={h.id_Hospital}>{h.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Rol <span style={{ color: '#e05' }}>*</span></label>
                <select value={empleado.rol_id} onChange={setE('rol_id')} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Seleccionar...</option>
                  {roles.map(r => (
                    <option key={r.id_Rol} value={r.id_Rol}>{r.descripcion}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Tipo de empleado <span style={{ color: '#e05' }}>*</span></label>
              <select value={empleado.tipo_empleado_id} onChange={setE('tipo_empleado_id')} className={inputClass} style={{ ...inputStyle, cursor: 'pointer', maxWidth: '50%' }}>
                <option value="">Seleccionar tipo...</option>
                {tiposEmpleado.map(t => (
                  <option key={t.id_Tipo} value={t.id_Tipo}>{t.descripcion}</option>
                ))}
              </select>
            </div>

            {saveError && (
              <div className="mb-4 px-3 py-2.5 rounded-lg text-sm" style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c' }}>
                {saveError}
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between pt-5" style={{ borderTop: '0.5px solid var(--md-border)' }}>
          {step === 0 ? (
            <button
              onClick={() => { setPersona(emptyPersona); setSaved(false) }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
              style={{ background: '#fff', border: '1.5px solid var(--md-green-dark)', color: 'var(--md-green-dark)', cursor: 'pointer' }}
            >
              <i className="ti ti-refresh" /> Limpiar
            </button>
          ) : (
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
              style={{ background: '#fff', border: '1.5px solid var(--md-green-dark)', color: 'var(--md-green-dark)', cursor: 'pointer' }}
            >
              <i className="ti ti-arrow-left" /> Volver
            </button>
          )}

          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--md-text-secondary)' }}>
            Paso {step + 1} de {STEPS.length}
            {STEPS.map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full inline-block" style={{ background: i <= step ? 'var(--md-green-dark)' : '#ddd' }} />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
            >
              Siguiente <i className="ti ti-arrow-right" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              <i className={`ti ${loading ? 'ti-loader-2' : 'ti-check'}`} />
              {loading ? 'Guardando...' : 'Guardar empleado'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
