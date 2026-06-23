import { Check } from 'lucide-react'
import { PricingPlan } from '../lib/types'

interface Props {
  plan: PricingPlan
  onSelect: (plan: PricingPlan) => void
  loading?: boolean
}

export default function PricingCard({ plan, onSelect, loading }: Props) {
  return (
    <div className={`card p-6 relative transition-all duration-200 hover:-translate-y-0.5 ${
      plan.popular
        ? 'border-brand-400 border-2 shadow-lg shadow-brand-100'
        : 'hover:border-ink-300'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Más popular
          </span>
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">{plan.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-ink-900">${plan.price}</span>
          {plan.id === 'pro' && <span className="text-ink-400 text-sm">/mes</span>}
        </div>
        <p className="text-sm text-ink-600 mt-1">{plan.description}</p>
      </div>

      <ul className="space-y-2.5 mb-6">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-ink-700">
            <Check size={14} className="text-brand-500 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          plan.popular
            ? 'bg-brand-500 text-white hover:bg-brand-600'
            : 'border border-ink-200 text-ink-800 hover:bg-ink-50'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Redirigiendo…' : plan.cta}
      </button>
    </div>
  )
}
