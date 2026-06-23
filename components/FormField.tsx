import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
  hint?: string
}

export default function FormField({ label, error, required, children, className, hint }: Props) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <label className="label">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
