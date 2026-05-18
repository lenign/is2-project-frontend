'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_SECTIONS = [
  {
    label: 'TIPO DE REGISTRO',
    items: [
      { id: 'medicos', href: '/dashboard/medicos', icon: 'ti-stethoscope', name: 'Médicos', desc: 'Registro de doctores y especialistas' },
      { id: 'enfermeras', href: '/dashboard/enfermeras', icon: 'ti-heart', name: 'Enfermeras', desc: 'Registro de personal de enfermería' },
      { id: 'pacientes', href: '/dashboard/pacientes', icon: 'ti-user', name: 'Pacientes', desc: 'Registro de pacientes' },
      { id: 'empleados', href: '/dashboard/empleados', icon: 'ti-briefcase', name: 'Empleados', desc: 'Registro de personal administrativo' },
    ],
  },
  {
    label: 'ADMINISTRACIÓN',
    items: [
      { id: 'roles', href: '/dashboard/roles', icon: 'ti-shield-check', name: 'Roles', desc: 'Gestión de roles del sistema' },
      { id: 'permisos', href: '/dashboard/permisos', icon: 'ti-lock', name: 'Permisos', desc: 'Administrar permisos' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col w-[230px] min-w-[230px] h-screen overflow-y-auto"
      style={{ background: 'var(--md-sidebar-bg)' }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-4 py-4"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--md-green-mid)' }}
        >
          <i className="ti ti-layout-grid text-white text-base" />
        </div>
        <div>
          <div className="text-white text-sm font-semibold">My Doctor</div>
          <div className="text-white/40 text-[10px]">Sistema de Registro</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="px-3 mt-3">
            <div className="text-white/35 text-[9px] font-semibold tracking-widest uppercase mb-1.5 px-1">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg mb-0.5 transition-colors"
                  style={{
                    background: isActive ? 'var(--md-sidebar-active)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--md-sidebar-hover)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <i className={`ti ${item.icon} text-white/70 text-sm`} />
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/75'}`}>
                      {item.name}
                    </div>
                    <div className="text-white/35 text-[9.5px]">{item.desc}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="flex items-center gap-2.5 px-3 py-3"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          style={{ background: 'var(--md-green-mid)' }}
        >
          DC
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-medium truncate">Dr. Carlos Mendoza</div>
          <div className="text-white/40 text-[9px]">Administrador</div>
        </div>
        <Link href="/login" className="text-white/35 hover:text-white/70 transition-colors">
          <i className="ti ti-logout text-base" />
        </Link>
      </div>
    </aside>
  )
}
