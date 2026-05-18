'use client'

import { useState } from 'react'

interface ToggleProps {
  defaultOn?: boolean
  onChange?: (value: boolean) => void
  size?: 'sm' | 'md'
}

export default function Toggle({ defaultOn = true, onChange, size = 'md' }: ToggleProps) {
  const [on, setOn] = useState(defaultOn)

  const toggle = () => {
    const next = !on
    setOn(next)
    onChange?.(next)
  }

  const w = size === 'sm' ? 32 : 36
  const h = size === 'sm' ? 18 : 20
  const dot = size === 'sm' ? 12 : 14

  return (
    <button
      onClick={toggle}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: w,
        height: h,
        background: on ? 'var(--md-green-dark)' : '#d1d5db',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-checked={on}
      role="switch"
    >
      <span
        className="absolute top-[3px] rounded-full bg-white transition-all duration-200"
        style={{
          width: dot,
          height: dot,
          left: on ? `calc(100% - ${dot + 2}px)` : '2px',
        }}
      />
    </button>
  )
}
