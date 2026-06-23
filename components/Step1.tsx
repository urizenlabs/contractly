import { ContractFormData, ValidationErrors } from '../lib/types'
import FormField from './FormField'
import clsx from 'clsx'

const JURISDICTIONS = [
  'Ecuador','México','Colombia','Argentina','España','Chile',
  'Perú','Uruguay','Venezuela','Bolivia','Paraguay','Guatemala',
  'Costa Rica','Panamá','Estados Unidos','Otro',
]

const LANGUAGES = ['Español','English','Português']

interface Props {
  data: Partial<ContractFormData>
  errors: ValidationErrors
  onChange: (field: keyof ContractFormData, value: string) => void
}

export default function Step1({ data, errors, onChange }: Props) {
  const inp = (field: keyof ContractFormData, placeholder: string, type = 'text') => (
    <input
      type={type}
      className={clsx('input', errors[field] && 'error')}
      placeholder={placeholder}
      value={(data[field] as string) || ''}
      onChange={e => onChange(field, e.target.value)}
    />
  )

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h2 className="text-lg font-semibold text-ink-900 mb-0.5">¿Quiénes son las partes?</h2>
        <p className="text-sm text-ink-500">Tus datos y los de tu cliente. Aparecerán en el encabezado del contrato.</p>
      </div>

      <div className="bg-ink-50 rounded-xl p-4 border border-ink-100">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Tus datos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nombre o empresa" error={errors.freelancerName} required>
            {inp('freelancerName', 'María García / Studio MG')}
          </FormField>
          <FormField label="Profesión / cargo" error={errors.freelancerRole} required>
            {inp('freelancerRole', 'Diseñadora UX, Dev Full-Stack…')}
          </FormField>
          <FormField label="Tu email" error={errors.freelancerEmail} required className="sm:col-span-2">
            {inp('freelancerEmail', 'tu@email.com', 'email')}
          </FormField>
        </div>
      </div>

      <div className="bg-ink-50 rounded-xl p-4 border border-ink-100">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Datos del cliente</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nombre del cliente" error={errors.clientName} required>
            {inp('clientName', 'Juan Pérez')}
          </FormField>
          <FormField label="Empresa (opcional)" error={errors.clientCompany}>
            {inp('clientCompany', 'Empresa SA de CV')}
          </FormField>
          <FormField label="Email del cliente" error={errors.clientEmail} required className="sm:col-span-2">
            {inp('clientEmail', 'cliente@empresa.com', 'email')}
          </FormField>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="País / jurisdicción" error={errors.jurisdiction} required
          hint="Determina las leyes aplicables al contrato">
          <select
            className={clsx('input', errors.jurisdiction && 'error')}
            value={data.jurisdiction || 'Ecuador'}
            onChange={e => onChange('jurisdiction', e.target.value)}
          >
            {JURISDICTIONS.map(j => <option key={j}>{j}</option>)}
          </select>
        </FormField>
        <FormField label="Idioma del contrato">
          <select
            className="input"
            value={data.language || 'Español'}
            onChange={e => onChange('language', e.target.value)}
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </FormField>
      </div>
    </div>
  )
}
