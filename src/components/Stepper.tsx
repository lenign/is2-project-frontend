interface Step {
  label: string
}

interface StepperProps {
  steps: Step[]
  current: number // 0-indexed
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center mb-6">
      {steps.map((step, i) => {
        const isDone = i < current
        const isActive = i === current
        return (
          <div key={i} className="flex items-center">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: isDone || isActive ? 'var(--md-green-dark)' : '#e8e8e8',
                color: isDone || isActive ? '#fff' : '#888',
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.25)' }}
              >
                {isDone ? <i className="ti ti-check text-[10px]" /> : i + 1}
              </div>
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-0.5 w-8 mx-1"
                style={{ background: isDone ? 'var(--md-green-dark)' : '#e0e0e0' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
