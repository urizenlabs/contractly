import { useState } from 'react'
import { X } from 'lucide-react'
import { PLANS } from '../lib/pricing'
import PricingCard from './PricingCard'
import { PricingPlan, ContractFormData } from '../lib/types'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
  onSuccess: () => void   // called if user has already paid / demo mode
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
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (e: any) {
      toast.error('Error al iniciar el pago: ' + e.message)
      setLoading(null)
    }
  }

  // Demo mode: skip payment in development
  function handleDemo() {
    toast('Modo demo: generando sin pago', { icon: '🧪' })
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-ink-100">
          <div>
            <h3 className="text-base font-semibold text-ink-900">Elige tu plan</h3>
            <p className="text-xs text-ink-500 mt-0.5">Accede a tu contrato inmediatamente después del pago</p>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 transition-colors">
            <X size={18} />
          </button>
        </div>

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

        <div className="px-6 pb-5 text-center">
          <button onClick={handleDemo} className="text-xs text-ink-400 hover:text-ink-600 underline underline-offset-2">
            Modo demo (sin pago, solo para pruebas)
          </button>
          <p className="text-xs text-ink-400 mt-2">
            🔒 Pago seguro con Stripe · Cancela cuando quieras · Sin letra chica
          </p>
        </div>
      </div>
    </div>
  )
}
