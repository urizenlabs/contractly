export interface ContractFormData {
  // Step 1 - Parties
  freelancerName: string
  freelancerRole: string
  freelancerEmail: string
  clientName: string
  clientEmail: string
  clientCompany: string
  jurisdiction: string
  language: string

  // Step 2 - Project
  serviceType: string
  projectTitle: string
  projectDescription: string
  deliverables: string

  // Step 3 - Terms
  totalAmount: string
  currency: string
  paymentStructure: string
  deadline: string
  revisions: string
  intellectualProperty: string
  confidentiality: boolean
  nonCompete: boolean
  extraClauses: string
}

export interface ValidationErrors {
  [key: string]: string
}

export type Step = 1 | 2 | 3 | 4

export interface PricingPlan {
  id: string
  name: string
  price: number
  priceId: string // Stripe Price ID
  description: string
  features: string[]
  cta: string
  popular?: boolean
}
