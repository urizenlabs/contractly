import { useState } from 'react'
import { X, FlaskConical } from 'lucide-react'
import { PLANS } from '../lib/pricing'
import PricingCard from './PricingCard'
import { PricingPlan, ContractFormData } from '../lib/types'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
  onSuccess: () => void
  formData: Partial<ContractFormData>
}

export default function PaywallModal({ onClose, onSuccess, formData }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSelect(plan: PricingPlan) {
    setLoading(plan.id)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id, formData }),
      })
      const data = await res.json()

      // Demo mode: API returned demo:true because Stripe is not configured
      if (data.demo) {
        toast('Modo demo activo — saltando pago', { icon: '🧪' })
        onSuccess()
        return
      }

      if (data.error) throw new Error(data.error)
      if (data.url) window.location.href = data.url
    } catch (e: any) {
      toast.error('Error: ' + e.message)
      setLoading(null)
    }
  }

  function handleDemoClick() {
    toast('Modo demo — generando contrato de prueba', { icon: '🧪' })
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-ink-100">
          <div>
            <h3 className="text-base font-semibold text-ink-900">Elige tu plan</h3>
            <p className="text-xs text-ink-500 mt-0.5">Accede a tu contrato inmediatamente tras el pago</p>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Demo mode banner — shown when Stripe not configured */}
        <div className="mx-6 mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <FlaskConical size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800">Modo demo activo</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Stripe no está configurado. Al elegir cualquier plan se saltará el pago y se generará un contrato de prueba real con tus datos.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLANS.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelect}
              loading={loading === plan.id}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 text-center space-y-2">
          <button
            onClick={handleDemoClick}
            className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-600 underline underline-offset-2 transition-colors"
          >
            <FlaskConical size={12} />
            Saltar al modo demo directamente
          </button>
          <p className="text-xs text-ink-300">
            En producción: pago seguro con Stripe · Cancela cuando quieras
          </p>
        </div>
      </div>
    </div>
  )
}
