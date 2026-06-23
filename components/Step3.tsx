import { ContractFormData, ValidationErrors } from '../lib/types'
import FormField from './FormField'
import clsx from 'clsx'

const CURRENCIES  = ['USD','EUR','MXN','COP','ARS','CLP','PEN','BRL']
const PAYMENT_STRUCTURES = [
  '50% al inicio, 50% al entregar',
  '30% al inicio, 70% al entregar',
  '100% por adelantado',
  '30% inicio, 40% a mitad, 30% al finalizar',
  'Pago mensual (proyecto largo plazo)',
  'Al completar cada hito definido',
  '100% al finalizar',
]
const REVISIONS = [
  '1 ronda de revisión incluida',
  '2 rondas de revisión incluidas',
  '3 rondas de revisión incluidas',
  'Revisiones ilimitadas en el plazo acordado',
  'Sin revisiones incluidas (entrega única)',
]
const IP_OPTIONS = [
  'Derechos ceden al cliente al recibir pago total',
  'El freelancer retiene la propiedad intelectual',
  'Licencia de uso exclusiva para el cliente',
  'Licencia de uso no exclusiva para el cliente',
  'Código open source (MIT License)',
]

interface Props {
  data: Partial<ContractFormData>
  errors: ValidationErrors
  onChange: (field: keyof ContractFormData, value: string | boolean) => void
}

export default function Step3({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h2 className="text-lg font-semibold text-ink-900 mb-0.5">Condiciones del contrato</h2>
        <p className="text-sm text-ink-500">Pagos, plazos y cláusulas legales que protegerán tu trabajo.</p>
      </div>

      {/* Economic */}
      <div className="bg-ink-50 rounded-xl p-4 border border-ink-100">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Económico</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FormField label="Valor total" error={errors.totalAmount} required>
            <input
              type="number"
              className={clsx('input', errors.totalAmount && 'error')}
              placeholder="2500"
              min="1"
              value={data.totalAmount || ''}
              onChange={e => onChange('totalAmount', e.target.value)}
            />
          </FormField>
          <FormField label="Moneda">
            <select className="input" value={data.currency || 'USD'} onChange={e => onChange('currency', e.target.value)}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </div>
        <FormField label="Estructura de pago" required>
          <select className="input" value={data.paymentStructure || PAYMENT_STRUCTURES[0]} onChange={e => onChange('paymentStructure', e.target.value)}>
            {PAYMENT_STRUCTURES.map(p => <option key={p}>{p}</option>)}
          </select>
        </FormField>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Plazo de entrega" error={errors.deadline} required hint="Sé específico: '15 días hábiles' o 'hasta el 30 de agosto'">
          <input
            type="text"
            className={clsx('input', errors.deadline && 'error')}
            placeholder="15 días hábiles"
            value={data.deadline || ''}
            onChange={e => onChange('deadline', e.target.value)}
          />
        </FormField>
        <FormField label="Revisiones incluidas">
          <select className="input" value={data.revisions || REVISIONS[1]} onChange={e => onChange('revisions', e.target.value)}>
            {REVISIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </FormField>
      </div>

      {/* Legal */}
      <FormField label="Propiedad intelectual y derechos de autor">
        <select className="input" value={data.intellectualProperty || IP_OPTIONS[0]} onChange={e => onChange('intellectualProperty', e.target.value)}>
          {IP_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </FormField>

      {/* Toggles */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => onChange('confidentiality', !data.confidentiality)}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
              data.confidentiality ? 'bg-brand-500' : 'bg-ink-200'
            }`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
              data.confidentiality ? 'left-5' : 'left-0.5'
            }`} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-800">Cláusula de confidencialidad (NDA)</p>
            <p className="text-xs text-ink-500">Protege la información confidencial compartida entre las partes</p>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => onChange('nonCompete', !data.nonCompete)}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
              data.nonCompete ? 'bg-brand-500' : 'bg-ink-200'
            }`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
              data.nonCompete ? 'left-5' : 'left-0.5'
            }`} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-800">Cláusula de no competencia / no solicitación</p>
            <p className="text-xs text-ink-500">Impide que el cliente contrate directamente a tus colaboradores por 12 meses</p>
          </div>
        </label>
      </div>

      {/* Extra */}
      <FormField label="Cláusulas adicionales (opcional)" hint="Cualquier condición especial que quieras incluir">
        <textarea
          className="input"
          style={{ minHeight: 80 }}
          placeholder="Ej: El cliente proveerá acceso al servidor en los primeros 2 días hábiles. Las reuniones de avance serán cada viernes a las 10am."
          value={data.extraClauses || ''}
          onChange={e => onChange('extraClauses', e.target.value)}
        />
      </FormField>
    </div>
  )
}
