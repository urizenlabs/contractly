import { useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import StepIndicator from '../components/StepIndicator'
import Step1 from '../components/Step1'
import Step2 from '../components/Step2'
import Step3 from '../components/Step3'
import ContractOutput from '../components/ContractOutput'
import PaywallModal from '../components/PaywallModal'
import { ContractFormData, ValidationErrors } from '../lib/types'
import { getStepErrors } from '../lib/validation'
import { ChevronLeft, ChevronRight, Sparkles, Loader } from 'lucide-react'

const STEPS = ['Partes', 'Proyecto', 'Condiciones', 'Contrato']

const DEFAULT_DATA: Partial<ContractFormData> = {
  jurisdiction: 'Ecuador',
  language: 'Español',
  serviceType: 'Desarrollo web / aplicaciones',
  currency: 'USD',
  paymentStructure: '50% al inicio, 50% al entregar',
  revisions: '2 rondas de revisión incluidas',
  intellectualProperty: 'Derechos ceden al cliente al recibir pago total',
  confidentiality: true,
  nonCompete: false,
}

export default function AppPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ContractFormData>>(DEFAULT_DATA)
  const [errors, setErrors]     = useState<ValidationErrors>({})
  const [contract, setContract] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  function handleChange(field: keyof ContractFormData, value: string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function handleNext() {
    const errs = getStepErrors(step, formData)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Completa los campos requeridos')
      return
    }
    setErrors({})
    if (step === 3) {
      setShowPaywall(true)
    } else {
      setStep(s => (s + 1) as any)
    }
  }

  function handleBack() {
    setErrors({})
    setStep(s => (s - 1) as any)
  }

  async function handleGenerate() {
    setShowPaywall(false)
    setGenerating(true)
    setStep(4)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContract(data.contract)
      toast.success('¡Contrato generado con éxito!')
    } catch (e: any) {
      toast.error('Error al generar: ' + (e.message || 'Inténtalo de nuevo'))
      setStep(3)
    } finally {
      setGenerating(false)
    }
  }

  function handleReset() {
    setStep(1)
    setFormData(DEFAULT_DATA)
    setContract('')
    setErrors({})
  }

  return (
    <>
      <Head>
        <title>Crear contrato · Contractly</title>
      </Head>

      <div className="min-h-screen bg-ink-50">
        <Navbar minimal />

        <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
          <StepIndicator current={step} steps={STEPS} />

          {/* Forms */}
          {step === 1 && <Step1 data={formData} errors={errors} onChange={handleChange} />}
          {step === 2 && <Step2 data={formData} errors={errors} onChange={handleChange} />}
          {step === 3 && <Step3 data={formData} errors={errors} onChange={handleChange} />}

          {/* Generating state */}
          {step === 4 && generating && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-up">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
                <Loader size={24} className="text-brand-500 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-ink-900 mb-1">Generando tu contrato…</p>
                <p className="text-sm text-ink-500">La IA está redactando 13 cláusulas legales para ti</p>
              </div>
              <div className="w-64 h-1.5 bg-ink-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-400 rounded-full shimmer" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {/* Contract output */}
          {step === 4 && !generating && contract && (
            <ContractOutput
              contract={contract}
              data={formData as ContractFormData}
              onReset={handleReset}
              onEdit={() => setStep(3)}
            />
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              {step > 1
                ? <button onClick={handleBack} className="btn-secondary">
                    <ChevronLeft size={16} /> Atrás
                  </button>
                : <div />
              }
              <button onClick={handleNext} className="btn-primary">
                {step === 3
                  ? <><Sparkles size={16} /> Generar contrato</>
                  : <>Continuar <ChevronRight size={16} /></>
                }
              </button>
            </div>
          )}
        </main>
      </div>

      {showPaywall && (
        <PaywallModal
          formData={formData}
          onClose={() => setShowPaywall(false)}
          onSuccess={handleGenerate}
        />
      )}
    </>
  )
}
