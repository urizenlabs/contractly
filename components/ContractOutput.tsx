import { useState } from 'react'
import { Download, Copy, Check, RotateCcw, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { ContractFormData } from '../lib/types'

interface Props {
  contract: string
  data: ContractFormData
  onReset: () => void
  onEdit: () => void
}

const BADGES = [
  { label: 'Propiedad intelectual', icon: '⚖️' },
  { label: 'Cláusula de pago',      icon: '💳' },
  { label: 'Confidencialidad',      icon: '🔒' },
  { label: 'Resolución conflictos', icon: '🤝' },
  { label: 'Límite responsabilidad',icon: '🛡️' },
]

export default function ContractOutput({ contract, data, onReset, onEdit }: Props) {
  const [copied, setCopied]  = useState(false)
  const [loading, setLoading] = useState(false)

  const wordCount = contract.trim().split(/\s+/).length

  async function handleDownloadPDF() {
    setLoading(true)
    try {
      const { generatePDF } = await import('../lib/pdf')
      await generatePDF(contract, data)
      toast.success('PDF descargado correctamente')
    } catch (e) {
      console.error(e)
      toast.error('Error al generar el PDF')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(contract)
    setCopied(true)
    toast.success('Contrato copiado al portapapeles')
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Palabras', value: wordCount.toLocaleString() },
          { label: 'Cláusulas',  value: '13+' },
          { label: 'Protección', value: `${Number(data.totalAmount).toLocaleString()} ${data.currency}` },
        ].map(s => (
          <div key={s.label} className="bg-ink-50 rounded-xl p-3 text-center border border-ink-100">
            <p className="text-base font-semibold text-ink-900">{s.value}</p>
            <p className="text-xs text-ink-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {BADGES.map(b => (
          <span key={b.label} className="flex items-center gap-1 text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2.5 py-1 rounded-full font-medium">
            <Check size={11} className="text-brand-500" />
            {b.label}
          </span>
        ))}
      </div>

      {/* Legal disclaimer */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
        <Shield size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          Este contrato fue generado por IA y es de referencia legal. Recomendamos revisarlo con un abogado local
          antes de firmarlo para proyectos de alto valor.
        </p>
      </div>

      {/* Contract text */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100 bg-ink-50">
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Contrato generado</span>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3">
              {copied ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar</>}
            </button>
          </div>
        </div>
        <div className="p-5 max-h-[520px] overflow-y-auto">
          <pre className="contract-preview">{contract}</pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="btn-primary flex-1 justify-center py-3"
        >
          <Download size={16} />
          {loading ? 'Generando PDF…' : 'Descargar PDF'}
        </button>
        <button onClick={onEdit} className="btn-secondary justify-center">
          <RotateCcw size={15} />
          Editar datos
        </button>
        <button onClick={onReset} className="btn-secondary justify-center text-ink-500">
          Nuevo contrato
        </button>
      </div>
    </div>
  )
}
