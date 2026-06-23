import { PricingPlan } from './types'

export const PLANS: PricingPlan[] = [
  {
    id: 'single',
    name: 'Un contrato',
    price: 9,
    priceId: 'price_single_REPLACE_WITH_STRIPE_ID',
    description: 'Perfecto para un proyecto puntual',
    features: [
      '1 contrato profesional',
      '13 cláusulas legales',
      'Exportación PDF inmediata',
      'Válido en tu jurisdicción',
    ],
    cta: 'Comprar por $9',
  },
  {
    id: 'pro',
    name: 'Pro mensual',
    price: 19,
    priceId: 'price_pro_REPLACE_WITH_STRIPE_ID',
    description: 'Para freelancers activos',
    features: [
      'Contratos ilimitados',
      'Todas las jurisdicciones',
      'Plantillas por industria',
      'Historial de contratos',
      'Soporte prioritario',
    ],
    cta: 'Empezar por $19/mes',
    popular: true,
  },
]

export const CONTRACT_PRICE_SINGLE = 900 // cents
export const CONTRACT_PRICE_PRO    = 1900 // cents
