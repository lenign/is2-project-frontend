'use client'

import { useState } from 'react'
import Toggle from '@/components/Toggle'
import Modal from '@/components/Modal'

const MODULE_STYLES: Record<string, { bg: string; color: string }> = {
  Pacientes:        { bg: '#e8f5ee', color: '#1b6e47' },
  Citas:            { bg: '#fff3e0', color: '#e07b00' },
  'Historial Médico': { bg: '#e8f0fe', color: '#3b5bdb' },
  Reportes:         { bg: '#fce8e8', color: '#c62828' },
  Configuración:    { bg: '#f3f0fe', color: '#6741d9' },
  Usuarios:         { bg: '#e8f5ee', color: '#2e7d32' },
}

const PERMISOS = [
  { name: 'Ver Pacientes',      code: 'PAC_VIEW',    module: 'Pacientes',        active: true },
  { name: 'Editar Pacientes',   code: 'PAC_EDIT',    module: 'Pacientes',        active: true },
  { name: 'Eliminar Pacientes', code: 'PAC_DELETE',  module: 'Pacientes',        active: false },
  { name: 'Crear Citas',        code: 'CIT_CREATE',  module: 'Citas',            active: true },
  { name: 'Ver Historial',      code: 'HIST_VIEW',   module: 'Historial Médico', active: true },
  { name: 'Generar Reportes',   code: 'REP_GEN',     module: 'Reportes',         active: true },
  { name: 'Configurar Sistema', code: 'SYS_CONFIG',  module: 'Configuración',    active: false },
  { name: 'Gestionar Usuarios', code: 'USR_MANAGE',  module: 'Usuarios',         active: true },
]

const MODULES = ['Todos los módulos', 'Pacientes', 'Citas', 'Historial Médico', 'Reportes', 'Configuración', 'Usuarios']

export default function PermisosPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('Todos los módulos')

  const filtered = PERMISOS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
    const matchModule = moduleFilter === 'Todos los módulos' || p.module === moduleFilter
    return matchSearch && matchModule
  })

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--md-green-light)' }}
          >
            <i className="ti ti-shield text-lg" style={{ color: 'var(--md-green-dark)' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>
              Gestión de Permisos
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              Administra los permisos del sistema para controlar el acceso a funcionalidades
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer' }}
        >
          <i className="ti ti-plus" /> Nuevo Permiso
        </button>
      </div>

      {/* Table card */}
      <div
        className="bg-white rounded-xl p-5"
        style={{ border: '2px solid #1b8a60' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>
              Permisos del Sistema
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--md-text-secondary)' }}>
              {filtered.length} permisos encontrados
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative flex-1 max-width-[320px]" style={{ maxWidth: 320 }}>
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit' }}
            />
          </div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-sm rounded-lg px-3 py-2 outline-none"
            style={{ border: '1px solid var(--md-border)', background: '#fff', fontFamily: 'inherit', cursor: 'pointer' }}
          >
            {MODULES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              {['Permiso', 'Código', 'Módulo', 'Estado', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold pb-2 px-3"
                  style={{ color: 'var(--md-text-secondary)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const modStyle = MODULE_STYLES[p.module] || { bg: '#f2f2f2', color: '#555' }
              return (
                <tr key={p.code} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
                  <td className="text-sm px-3 py-2.5" style={{ color: 'var(--md-text-primary)' }}>{p.name}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{ background: '#f0f0f0', color: '#555' }}
                    >
                      {p.code}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded font-medium"
                      style={{ background: modStyle.bg, color: modStyle.color }}
                    >
                      {p.module}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Toggle defaultOn={p.active} size="sm" />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-300 hover:text-gray-500 hover:bg-gray-100 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <i className="ti ti-pencil text-sm" />
                      </button>
                      <button
                        className="text-gray-300 hover:text-red-400 hover:bg-red-50 p-1 rounded"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <i className="ti ti-trash text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Crear Nuevo Permiso"
        subtitle="Ingresa los datos del nuevo permiso"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
              Nombre del Permiso
            </label>
            <input
              type="text"
              placeholder="Ej: Ver Pacientes"
              className="w-full px-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1.5px solid var(--md-green-dark)', fontFamily: 'inherit' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
              Código
            </label>
            <input
              type="text"
              placeholder="Ej: PAC_VIEW"
              className="w-full px-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
              Módulo
            </label>
            <select
              className="w-full px-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: '1px solid var(--md-border)', background: '#fff', fontFamily: 'inherit' }}
            >
              <option value="">Seleccionar módulo...</option>
              {MODULES.slice(1).map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--md-text-secondary)' }}>
              Descripción
            </label>
            <textarea
              placeholder="Describe qué permite este permiso"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none"
              style={{ border: '1px solid var(--md-border)', fontFamily: 'inherit' }}
            />
          </div>
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2 text-sm rounded-lg transition-colors hover:bg-gray-50"
              style={{ border: '1px solid var(--md-border)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancelar
            </button>
            <button
              className="flex-1 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: 'var(--md-green-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Crear Permiso
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
