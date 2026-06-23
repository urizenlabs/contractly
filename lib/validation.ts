import { ContractFormData, ValidationErrors } from './types'

export function validateStep1(data: Partial<ContractFormData>): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!data.freelancerName?.trim()) errors.freelancerName = 'Ingresa tu nombre o empresa'
  if (!data.freelancerRole?.trim()) errors.freelancerRole = 'Ingresa tu profesión'
  if (!data.freelancerEmail?.trim()) errors.freelancerEmail = 'Ingresa tu email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.freelancerEmail))
    errors.freelancerEmail = 'Email inválido'
  if (!data.clientName?.trim()) errors.clientName = 'Ingresa el nombre del cliente'
  if (!data.clientEmail?.trim()) errors.clientEmail = 'Ingresa el email del cliente'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail))
    errors.clientEmail = 'Email inválido'
  return errors
}

export function validateStep2(data: Partial<ContractFormData>): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!data.projectTitle?.trim()) errors.projectTitle = 'Ingresa un título para el proyecto'
  if (!data.projectDescription?.trim() || data.projectDescription.length < 30)
    errors.projectDescription = 'Describe el proyecto con al menos 30 caracteres'
  if (!data.deliverables?.trim()) errors.deliverables = 'Especifica al menos un entregable'
  return errors
}

export function validateStep3(data: Partial<ContractFormData>): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!data.totalAmount?.trim() || isNaN(Number(data.totalAmount)) || Number(data.totalAmount) <= 0)
    errors.totalAmount = 'Ingresa un valor válido mayor a 0'
  if (!data.deadline?.trim()) errors.deadline = 'Especifica el plazo de entrega'
  return errors
}

export function getStepErrors(step: number, data: Partial<ContractFormData>): ValidationErrors {
  if (step === 1) return validateStep1(data)
  if (step === 2) return validateStep2(data)
  if (step === 3) return validateStep3(data)
  return {}
}
