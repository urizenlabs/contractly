import { PricingPlan } from './types'

export const PLANS: PricingPlan[] = [
  {
    id: 'single',
    name: 'Contrato único',
    price: 9,
    priceId: 'price_single_REPLACE_WITH_STRIPE_ID',
    description: 'Para un proyecto puntual. Sin compromisos.',
    features: [
      '1 contrato completo en PDF',
      '13 cláusulas legales redactadas por IA',
      'Anticipo + propiedad intelectual incluidos',
      'Anti-scope creep y límite de revisiones',
      'Adaptado a tu país y tu proyecto',
    ],
    cta: 'Obtener por $9',
  },
  {
    id: 'pro',
    name: 'Pro mensual',
    price: 19,
    priceId: 'price_pro_REPLACE_WITH_STRIPE_ID',
    description: 'Ilimitado. Para quien factura seguido.',
    features: [
      'Contratos ilimitados cada mes',
      '8+ jurisdicciones de LATAM y España',
      'Plantillas por industria (dev, diseño, mkt…)',
      'Regenera sin límite hasta que quede perfecto',
      'Acceso prioritario a funciones nuevas',
    ],
    cta: 'Activar Pro por $19/mes',
    popular: true,
  },
]

export const CONTRACT_PRICE_SINGLE = 900 // cents
export const CONTRACT_PRICE_PRO    = 1900 // cents
