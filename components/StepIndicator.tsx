import { Check } from 'lucide-react'

interface Props {
  current: number
  steps: string[]
}

export default function StepIndicator({ current, steps }: Props) {
  return (
    <div className="flex items-center gap-0 mb-8 select-none">
      {steps.map((label, i) => {
        const n = i + 1
        const done   = n < current
        const active = n === current
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`step-dot ${done ? 'done' : active ? 'active' : 'pending'}`}>
                {done ? <Check size={14} /> : n}
              </div>
              <span className={`text-xs mt-1 font-medium whitespace-nowrap ${
                active ? 'text-brand-500' : done ? 'text-brand-400' : 'text-ink-400'
              }`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-10 sm:w-16 mx-1 mb-4 transition-all duration-500 ${
                done ? 'bg-brand-300' : 'bg-ink-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
