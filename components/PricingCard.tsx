import { Check, ArrowRight } from 'lucide-react'
import { PricingPlan } from '../lib/types'

interface Props {
  plan: PricingPlan
  onSelect: (plan: PricingPlan) => void
  loading?: boolean
}

const ROI: Record<string, string> = {
  single: 'Protege hasta $50,000 en proyectos',
  pro:    'Ahorra $281+ en honorarios cada mes',
}

export default function PricingCard({ plan, onSelect, loading }: Props) {
  const isPopular = plan.popular

  return (
    <div className={`relative rounded-2xl p-6 flex flex-col transition-all duration-200 ${
      isPopular
        ? 'bg-brand-500 text-white shadow-xl shadow-brand-200'
        : 'bg-white border border-ink-200 hover:border-brand-300 hover:shadow-md hover:shadow-brand-50'
    }`}>
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-ink-900 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
            ✦ MÁS POPULAR
          </span>
        </div>
      )}

      {/* Plan name + price */}
      <div className="mb-5">
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${
          isPopular ? 'text-brand-200' : 'text-ink-400'
        }`}>
          {plan.name}
        </p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-ink-900'}`}>
            ${plan.price}
          </span>
          {plan.id === 'pro' && (
            <span className={`text-sm ${isPopular ? 'text-brand-200' : 'text-ink-400'}`}>/mes</span>
          )}
        </div>
        {/* ROI line */}
        <p className={`text-xs font-medium ${isPopular ? 'text-brand-100' : 'text-green-600'}`}>
          {ROI[plan.id]}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className={`flex items-start gap-2.5 text-sm ${isPopular ? 'text-white/90' : 'text-ink-700'}`}>
            <Check
              size={14}
              className={`flex-shrink-0 mt-0.5 ${isPopular ? 'text-brand-200' : 'text-brand-500'}`}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
          isPopular
            ? 'bg-white text-brand-600 hover:bg-brand-50 shadow-md'
            : 'bg-ink-900 text-white hover:bg-ink-800'
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Redirigiendo…
          </>
        ) : (
          <>
            {plan.cta}
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  )
}
