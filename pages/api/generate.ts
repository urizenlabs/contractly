import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { formData } = req.body
  if (!formData) return res.status(400).json({ error: 'Missing form data' })

  const {
    freelancerName, freelancerRole, freelancerEmail,
    clientName, clientEmail, clientCompany,
    jurisdiction, language,
    serviceType, projectTitle, projectDescription, deliverables,
    totalAmount, currency, paymentStructure, deadline,
    revisions, intellectualProperty, confidentiality, nonCompete, extraClauses,
  } = formData

  const today = new Date().toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const systemPrompt = `Eres un abogado especialista en contratos de servicios digitales y freelance con 20 años de experiencia en ${jurisdiction}. 
Generas contratos legalmente robustos, claros y directamente firmables. 
Nunca uses placeholders genéricos — usa siempre los datos reales proporcionados.
El contrato debe ser en ${language}.
Usa únicamente texto plano sin markdown (sin asteriscos, sin #, sin **). 
Usa mayúsculas para los títulos de sección. Numera cada cláusula.`

  const userPrompt = `Genera un CONTRATO DE SERVICIOS PROFESIONALES completo con estos datos:

FECHA: ${today}

PRESTADOR DE SERVICIOS:
- Nombre: ${freelancerName}
- Profesión: ${freelancerRole}
- Email: ${freelancerEmail}

CLIENTE:
- Nombre: ${clientName}
- Email: ${clientEmail}
${clientCompany ? `- Empresa: ${clientCompany}` : ''}
- Jurisdicción: ${jurisdiction}

PROYECTO:
- Tipo: ${serviceType}
- Título: ${projectTitle}
- Descripción: ${projectDescription}
- Entregables:
${deliverables}

CONDICIONES ECONÓMICAS:
- Valor total: ${totalAmount} ${currency}
- Estructura de pago: ${paymentStructure}
- Plazo de entrega: ${deadline}
- Revisiones incluidas: ${revisions}
- Derechos de propiedad intelectual: ${intellectualProperty}
- Cláusula de confidencialidad: ${confidentiality ? 'Sí, incluir' : 'No requerida'}
- Non-compete: ${nonCompete ? 'Sí, incluir cláusula de no competencia por 12 meses' : 'No requerida'}
${extraClauses ? `\nCLÁUSULAS ADICIONALES SOLICITADAS:\n${extraClauses}` : ''}

El contrato DEBE incluir estas secciones en este orden exacto:
1. IDENTIFICACIÓN DE LAS PARTES
2. OBJETO DEL CONTRATO
3. ENTREGABLES Y ALCANCE DEL TRABAJO
4. PLAZO DE EJECUCIÓN Y CRONOGRAMA
5. VALOR TOTAL Y ESTRUCTURA DE PAGO
6. REVISIONES Y APROBACIONES
7. DERECHOS DE PROPIEDAD INTELECTUAL Y CESIÓN
8. CONFIDENCIALIDAD Y NO DIVULGACIÓN${nonCompete ? '\n9. NO COMPETENCIA Y NO SOLICITACIÓN' : ''}
${nonCompete ? '10' : '9'}. LIMITACIÓN DE RESPONSABILIDAD
${nonCompete ? '11' : '10'}. CAUSALES DE TERMINACIÓN ANTICIPADA
${nonCompete ? '12' : '11'}. RESOLUCIÓN DE CONFLICTOS Y JURISDICCIÓN
${nonCompete ? '13' : '12'}. DISPOSICIONES GENERALES Y MODIFICACIONES
${nonCompete ? '14' : '13'}. FIRMAS Y ACEPTACIÓN

Cada cláusula debe ser completa, específica y legalmente protectora para ambas partes. 
Al final, incluye bloques para firma, nombre completo, cargo y fecha de ambas partes.`

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const text = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as any).text)
      .join('')

    return res.status(200).json({ contract: text, tokens: message.usage })
  } catch (err: any) {
    console.error('Anthropic error:', err)
    return res.status(500).json({ error: err.message || 'Error al generar el contrato' })
  }
}
