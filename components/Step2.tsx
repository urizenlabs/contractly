import { ContractFormData, ValidationErrors } from '../lib/types'
import FormField from './FormField'
import clsx from 'clsx'

const SERVICE_TYPES = [
  'Desarrollo web / aplicaciones',
  'Diseño gráfico / UI/UX',
  'Marketing digital / SEO',
  'Redacción y contenido',
  'Consultoría estratégica',
  'Video / animación / motion',
  'Fotografía',
  'Desarrollo de software a medida',
  'Community management',
  'Otro',
]

interface Props {
  data: Partial<ContractFormData>
  errors: ValidationErrors
  onChange: (field: keyof ContractFormData, value: string) => void
}

export default function Step2({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h2 className="text-lg font-semibold text-ink-900 mb-0.5">Describe el proyecto</h2>
        <p className="text-sm text-ink-500">Cuanto más detallado, más fuerte y específico será tu contrato.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Tipo de servicio" required>
          <select
            className="input"
            value={data.serviceType || SERVICE_TYPES[0]}
            onChange={e => onChange('serviceType', e.target.value)}
          >
            {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Título del proyecto" error={errors.projectTitle} required>
          <input
            type="text"
            className={clsx('input', errors.projectTitle && 'error')}
            placeholder="Ej: Landing page para lanzamiento SaaS"
            value={data.projectTitle || ''}
            onChange={e => onChange('projectTitle', e.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="Descripción detallada del trabajo"
        error={errors.projectDescription}
        required
        hint="Incluye el contexto, el objetivo y lo que harás específicamente"
      >
        <textarea
          className={clsx('input', errors.projectDescription && 'error')}
          style={{ minHeight: 120 }}
          placeholder="Ej: Diseño y desarrollo completo de una landing page para el lanzamiento de un producto SaaS B2B. Incluye diseño en Figma, maquetación en Next.js, versión responsive para mobile y tablet, integración de formulario de captura con Mailchimp y hasta 3 rondas de revisión del diseño antes de implementar."
          value={data.projectDescription || ''}
          onChange={e => onChange('projectDescription', e.target.value)}
        />
      </FormField>

      <FormField
        label="Entregables específicos"
        error={errors.deliverables}
        required
        hint="Lista cada entregable en una línea separada"
      >
        <textarea
          className={clsx('input', errors.deliverables && 'error')}
          style={{ minHeight: 100 }}
          placeholder={`Diseño en Figma (desktop + mobile)\nCódigo fuente en repositorio GitHub\nVersión deployada en Vercel\nManual básico de uso`}
          value={data.deliverables || ''}
          onChange={e => onChange('deliverables', e.target.value)}
        />
      </FormField>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-3.5">
        <p className="text-xs font-semibold text-brand-600 mb-1">💡 Tip profesional</p>
        <p className="text-xs text-brand-700">
          Define los entregables con precisión: "5 pantallas diseñadas en Figma" es mucho mejor que "el diseño".
          Esto evita el scope creep — cuando el cliente pide más de lo acordado.
        </p>
      </div>
    </div>
  )
}
