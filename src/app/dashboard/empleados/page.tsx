'use client'

import { useState } from 'react'
import Stepper from '@/components/Stepper'

const STEPS = [{ label: 'Datos personales' }, { label: 'Datos del empleado' }]

export default function EmpleadosPage() {
  const [step, setStep] = useState(1)

  const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg outline-none"
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
          Registro de Empleado
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--md-text-secondary)' }}>
          Complete los datos para registrar personal administrativo.
        </p>

        <Stepper steps={STEPS} current={step} />

        {/* Success banner */}
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
          Datos del empleado
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-5">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Contraseña</label>
            <input type="password" defaultValue="12345678" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Fecha de ingreso</label>
            <input type="date" className={inputClass} style={inputStyle} />
          </div>
        </div>

        <div
          className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
          style={{ color: 'var(--md-text-secondary)' }}
        >
          Asignación institucional
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Hospital</label>
            <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Seleccionar...</option>
              <option>Hospital Central</option>
              <option>Clínica Norte</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Rol</label>
            <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Seleccionar...</option>
              <option>Administrador</option>
              <option>Recepcionista</option>
              <option>Médico</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>Tipo de empleado</label>
          <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer', maxWidth: '50%' }}>
            <option value="">Seleccionar tipo...</option>
            <option>Tiempo completo</option>
            <option>Medio tiempo</option>
            <option>Contrato</option>
          </select>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-5"
          style={{ borderTop: '0.5px solid var(--md-border)' }}
        >
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

          <div className="flex items-center gap-2 text-xs underline" style={{ color: 'var(--md-text-secondary)', cursor: 'pointer' }}>
            Paso {step + 1} de {STEPS.length}
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: i <= step ? 'var(--md-green-dark)' : '#ddd' }}
              />
            ))}
          </div>

          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
          >
            <i className="ti ti-check" /> Guardar empleado
          </button>
        </div>
      </div>
    </div>
  )
}
