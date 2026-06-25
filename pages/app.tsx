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
import { ChevronLeft, ChevronRight, Sparkles, Loader, FlaskConical } from 'lucide-react'

const STEPS = ['Partes', 'Proyecto', 'Condiciones', 'Contrato']

// Pre-filled demo data so testers can click through quickly
const DEFAULT_DATA: Partial<ContractFormData> = {
  freelancerName:      'María García',
  freelancerRole:      'Diseñadora UX / UI',
  freelancerEmail:     'maria@estudio.com',
  clientName:          'Carlos Romero',
  clientEmail:         'carlos@empresa.com',
  clientCompany:       'TechStartup SA',
  jurisdiction:        'Ecuador',
  language:            'Español',
  serviceType:         'Diseño gráfico / UI/UX',
  projectTitle:        'Rediseño de dashboard SaaS',
  projectDescription:  'Diseño completo de interfaz para plataforma SaaS B2B, incluyendo sistema de componentes en Figma, guía de estilos y 5 pantallas principales responsive.',
  deliverables:        'Sistema de diseño en Figma\nGuía de estilos (colores, tipografía, iconografía)\n5 pantallas: Login, Dashboard, Reportes, Configuración, Perfil\nVersión desktop y mobile de cada pantalla\nHandoff con notas para desarrollo',
  currency:            'USD',
  totalAmount:         '2500',
  paymentStructure:    '50% al inicio, 50% al entregar',
  deadline:            '20 días hábiles',
  revisions:           '2 rondas de revisión incluidas',
  intellectualProperty:'Derechos ceden al cliente al recibir pago total',
  confidentiality:     true,
  nonCompete:          false,
}

export default function AppPage() {
  const [step, setStep]           = useState(1)
  const [formData, setFormData]   = useState<Partial<ContractFormData>>(DEFAULT_DATA)
  const [errors, setErrors]       = useState<ValidationErrors>({})
  const [contract, setContract]   = useState<string>('')
  const [isDemoContract, setIsDemoContract] = useState(false)
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
      setIsDemoContract(!!data.demo)
      toast.success(data.demo ? 'Contrato demo generado ✓' : '¡Contrato generado con éxito!')
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
    setIsDemoContract(false)
  }

  return (
    <>
      <Head>
        <title>Crear contrato · Contractly</title>
      </Head>

      <div className="min-h-screen bg-ink-50">
        <Navbar minimal />

        {/* Demo mode banner — top of page */}
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2">
            <FlaskConical size={13} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              <strong>Modo demo activo.</strong> El formulario viene pre-rellenado. Puedes editar los datos o ir directo a "Generar contrato" para probar el flujo completo — sin pago, sin APIs.
            </p>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
          <StepIndicator current={step} steps={STEPS} />

          {/* Forms */}
          {step === 1 && <Step1 data={formData} errors={errors} onChange={handleChange} />}
          {step === 2 && <Step2 data={formData} errors={errors} onChange={handleChange} />}
          {step === 3 && <Step3 data={formData} errors={errors} onChange={handleChange} />}

          {/* Generating */}
          {step === 4 && generating && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-up">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
                <Loader size={24} className="text-brand-500 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-ink-900 mb-1">Generando tu contrato…</p>
                <p className="text-sm text-ink-500">Redactando 13 cláusulas con tus datos reales</p>
              </div>
              <div className="w-64 h-1.5 bg-ink-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-400 rounded-full shimmer" style={{ width: '70%' }} />
              </div>
            </div>
          )}

          {/* Contract output */}
          {step === 4 && !generating && contract && (
            <>
              {isDemoContract && (
                <div className="mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <FlaskConical size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">Contrato de demo</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Generado con plantilla local (sin IA). Todos los datos del formulario están incluidos. La exportación a PDF funciona igual que en producción. Para contratos con IA, configura <code className="bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code>.
                    </p>
                  </div>
                </div>
              )}
              <ContractOutput
                contract={contract}
                data={formData as ContractFormData}
                onReset={handleReset}
                onEdit={() => setStep(3)}
              />
            </>
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
