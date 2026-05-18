'use client'

import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, subtitle, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative rounded-2xl p-7 w-full max-w-sm"
        style={{ background: '#fff', border: '0.5px solid var(--md-border)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center text-sm text-gray-400 hover:bg-gray-100"
          style={{ background: '#f0f0f0', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--md-text-primary)' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mb-5" style={{ color: 'var(--md-text-secondary)' }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
