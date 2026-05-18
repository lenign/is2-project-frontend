'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    router.push('/dashboard/roles')
  }

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div
        className="relative flex flex-col items-center justify-center p-8 overflow-hidden"
        style={{ width: '45%', background: 'var(--md-green-dark)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full border-2 border-white/10" />
        <div className="absolute -bottom-10 -right-12 w-40 h-40 rounded-full border-2 border-white/10" />
        <div className="absolute top-1/2 left-2/3 w-24 h-24 rounded-full border-2 border-white/10" />

        {/* Icons */}
        <div className="flex gap-4 mb-6 z-10">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <i className="ti ti-stethoscope text-white text-2xl" />
          </div>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <i className="ti ti-chart-bar text-white text-2xl" />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center z-10 mb-7">
          <h2 className="text-2xl font-bold text-white">My Doctor</h2>
          <p className="text-sm text-white/60 mt-1">Sistema de Registro Hospitalario</p>
        </div>

        {/* Features */}
        <div className="z-10 w-full rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.15)' }}>
          {[
            { num: 1, title: 'Registro de Pacientes', desc: 'Gestión integral de expedientes' },
            { num: 2, title: 'Gestión de empleados', desc: 'Médicos, enfermeras y empleados' },
            { num: 3, title: 'Control de Acceso', desc: 'Roles y permisos granulares' },
          ].map((f) => (
            <div key={f.num} className="flex items-start gap-3 mb-3 last:mb-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                {f.num}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{f.title}</div>
                <div className="text-xs text-white/50">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#f7f8f7' }}>
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{ background: 'var(--md-card-bg)', border: '0.5px solid var(--md-border)' }}
        >
          <h1 className="text-xl font-semibold text-center mb-1" style={{ color: 'var(--md-text-primary)' }}>
            Iniciar Sesión
          </h1>
          <p className="text-xs text-center mb-6" style={{ color: 'var(--md-text-secondary)' }}>
            Ingrese sus credenciales para acceder al sistema
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
              Correo Electrónico
            </label>
            <div className="relative">
              <i className="ti ti-mail absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-base" />
              <input
                type="email"
                placeholder="ejemplo@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none transition-all"
                style={{
                  border: '1px solid var(--md-border)',
                  fontFamily: 'inherit',
                  color: 'var(--md-text-primary)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--md-green-dark)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--md-border)')}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium" style={{ color: 'var(--md-text-secondary)' }}>
                Contraseña
              </label>
              <span className="text-xs cursor-pointer" style={{ color: 'var(--md-green-dark)' }}>
                ¿Olvidó su contraseña?
              </span>
            </div>
            <div className="relative">
              <i className="ti ti-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-base" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg outline-none"
                style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit', color: 'var(--md-text-primary)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--md-green-dark)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--md-border)')}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'} text-base`} />
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center gap-2 mb-5">
            <input type="checkbox" className="w-3.5 h-3.5 accent-green-700" />
            <span className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>Recordar mis datos</span>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            className="w-full py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ background: 'var(--md-green-dark)' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#155c3a')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'var(--md-green-dark)')}
          >
            Ingresar al sistema
          </button>

          <p className="text-xs text-center mt-4" style={{ color: 'var(--md-text-hint)' }}>
            Sistema protegido. Acceso solo para personal autorizado.
          </p>
        </div>
      </div>
    </div>
  )
}
