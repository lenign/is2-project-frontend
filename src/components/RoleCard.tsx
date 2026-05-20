'use client'

import Toggle from './Toggle'

interface RoleCardProps {
  name: string
  description: string
  permissionCount: number
  permissions: string[]
  extraCount: number
  accentColor: string
  dotColor: string
  defaultActive?: boolean
  onToggle?: (value: boolean) => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function RoleCard({
  name,
  description,
  permissionCount,
  permissions,
  extraCount,
  accentColor,
  dotColor,
  defaultActive = true,
  onToggle,
  onEdit,
  onDelete,
}: RoleCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col"
      style={{ border: `2px solid ${accentColor}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--md-text-primary)' }}>
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dotColor }} />
          {name}
        </div>
        <Toggle defaultOn={defaultActive} size="sm" onChange={onToggle} />
      </div>

      <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--md-text-secondary)' }}>
        {description}
      </p>

      <div className="text-[9.5px] font-semibold tracking-wide uppercase mb-1.5" style={{ color: 'var(--md-text-secondary)' }}>
        Permisos ({permissionCount})
      </div>

      <div className="flex flex-wrap gap-1 mb-1">
        {permissions.map((p) => (
          <span
            key={p}
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: '#f2f2f2', border: '0.5px solid #e0e0e0', color: '#555' }}
          >
            {p}
          </span>
        ))}
      </div>

      {extraCount > 0 && (
        <div className="text-xs font-medium mb-3" style={{ color: 'var(--md-green-dark)' }}>
          +{extraCount} más
        </div>
      )}
      {extraCount === 0 && <div className="mb-3 h-4" />}

      {/* Actions */}
      <div
        className="flex items-center gap-2 pt-3 mt-auto"
        style={{ borderTop: '0.5px solid var(--md-border)' }}
      >
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg transition-colors hover:bg-gray-50"
          style={{
            background: '#fff',
            border: '1px solid var(--md-border)',
            color: 'var(--md-text-secondary)',
            cursor: 'pointer',
          }}
        >
          <i className="ti ti-pencil text-sm" /> Editar
        </button>
        <button
          onClick={onDelete}
          className="px-2.5 py-1.5 rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
          style={{ background: '#fff', border: '1px solid var(--md-border)', cursor: 'pointer' }}
        >
          <i className="ti ti-trash text-sm" />
        </button>
      </div>
    </div>
  )
}
