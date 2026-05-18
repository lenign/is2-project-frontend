'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Stepper from '@/components/Stepper'

const STEPS = [{ label: 'Datos personales' }, { label: 'Datos médicos' }]

export default function MedicosPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg outline-none transition-all"
  const inputStyle = {
    border: '1px solid var(--md-border)',
    fontFamily: 'inherit',
    color: 'var(--md-text-primary)',
    background: '#fff',
  }

  return (
    <div className="p-7">
      <div
        className="bg-white rounded-xl p-8 max-w-2xl"
        style={{ border: '0.5px solid var(--md-border)' }}
      >
        <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--md-text-primary)' }}>
          Registro de Médico
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--md-text-secondary)' }}>
          Complete los datos para registrar un nuevo médico en el sistema.
        </p>

        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <>
            <div
              className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
              style={{ color: 'var(--md-text-secondary)' }}
            >
              Identificación
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Nombre</label>
                <input type="text" placeholder="Nombre(s)" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Apellidos</label>
                <input type="text" placeholder="Apellidos" className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
                  DNI <span style={{ color: '#e05' }}>*</span>
                </label>
                <input type="text" placeholder="Ej. 12345678" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Sexo</label>
                <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Seleccionar...</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Fecha de nacimiento</label>
              <input type="date" className={inputClass} style={inputStyle} />
            </div>

            <div
              className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
              style={{ color: 'var(--md-text-secondary)' }}
            >
              Contacto
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-8">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Teléfono</label>
                <input type="tel" placeholder="+504 9999-9999" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Correo electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" className={inputClass} style={inputStyle} />
                <span className="text-xs mt-1 block" style={{ color: 'var(--md-text-secondary)' }}>Se usará para notificaciones.</span>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-5 text-sm"
              style={{ background: 'var(--md-green-light)', border: '1px solid var(--md-green-border)', color: 'var(--md-green-dark)' }}
            >
              <i className="ti ti-circle-check" /> Persona vinculada: Obtenido del paso anterior
            </div>

            <div
              className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
              style={{ color: 'var(--md-text-secondary)' }}
            >
              Datos del médico
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Número de colegiado</label>
                <input type="text" placeholder="Ej. COL-12345" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Especialidad</label>
                <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Seleccionar...</option>
                  <option>Medicina General</option>
                  <option>Cardiología</option>
                  <option>Pediatría</option>
                  <option>Neurología</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-8">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Hospital asignado</label>
                <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Seleccionar...</option>
                  <option>Hospital Central</option>
                  <option>Clínica Norte</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Turno</label>
                <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Seleccionar...</option>
                  <option>Mañana</option>
                  <option>Tarde</option>
                  <option>Noche</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-5"
          style={{ borderTop: '0.5px solid var(--md-border)' }}
        >
          {step === 0 ? (
            <button
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
              style={{
                background: '#fff',
                border: '1.5px solid var(--md-green-dark)',
                color: 'var(--md-green-dark)',
                cursor: 'pointer',
              }}
            >
              <i className="ti ti-refresh" /> Limpiar
            </button>
          ) : (
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
              style={{
                background: '#fff',
                border: '1.5px solid var(--md-green-dark)',
                color: 'var(--md-green-dark)',
                cursor: 'pointer',
              }}
            >
              <i className="ti ti-arrow-left" /> Volver
            </button>
          )}

          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--md-text-secondary)' }}>
            Paso {step + 1} de {STEPS.length}
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: i <= step ? 'var(--md-green-dark)' : '#ddd' }}
              />
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
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
            >
              <i className="ti ti-check" /> Guardar médico
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
