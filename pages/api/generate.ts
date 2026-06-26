import type { NextApiRequest, NextApiResponse } from 'next'

//  Demo contract template 
// Fills in real form values so the PDF export is meaningful even sin IA.

function buildDemoContract(f: Record<string, any>): string {
  const today = new Date().toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const deliverableLines = (f.deliverables || 'Entregables acordados')
    .split('\n')
    .filter(Boolean)
    .map((d: string, i: number) => `   ${i + 1}. ${d.trim()}`)
    .join('\n')

  const advancePct  = f.paymentStructure?.includes('50%') ? '50' : f.paymentStructure?.includes('30%') ? '30' : '50'
  const advanceAmt  = ((Number(f.totalAmount) || 0) * Number(advancePct) / 100).toLocaleString('es-ES')
  const balanceAmt  = ((Number(f.totalAmount) || 0) * (1 - Number(advancePct) / 100)).toLocaleString('es-ES')

  return `CONTRATO DE SERVICIOS PROFESIONALES
[MODO DEMO  Contrato generado sin IA para pruebas]

Fecha: ${today}
Jurisdicción: ${f.jurisdiction || 'Ecuador'}


1. IDENTIFICACIÓN DE LAS PARTES

PRESTADOR DE SERVICIOS:
Nombre:     ${f.freelancerName || 'Nombre del Freelancer'}
Profesión:  ${f.freelancerRole || 'Profesional Independiente'}
Email:      ${f.freelancerEmail || 'freelancer@email.com'}

CLIENTE:
Nombre:     ${f.clientName || 'Nombre del Cliente'}
${f.clientCompany ? `Empresa:    ${f.clientCompany}` : ''}
Email:      ${f.clientEmail || 'cliente@email.com'}

En adelante, "el Prestador" y "el Cliente" respectivamente.


2. OBJETO DEL CONTRATO

El presente contrato tiene por objeto regular la prestación de servicios de
${f.serviceType || 'servicios profesionales'} por parte del Prestador al Cliente,
específicamente para el proyecto denominado: "${f.projectTitle || 'Proyecto acordado'}".

Descripción del proyecto:
${f.projectDescription || 'Servicios profesionales según descripción acordada entre las partes.'}


3. ENTREGABLES Y ALCANCE DEL TRABAJO

El Prestador se compromete a entregar los siguientes elementos:

${deliverableLines}

Cualquier trabajo adicional no contemplado en esta lista deberá ser acordado
por escrito y cotizado de forma separada antes de su ejecución.


4. PLAZO DE EJECUCIÓN Y CRONOGRAMA

El plazo de entrega acordado es: ${f.deadline || 'según acuerdo entre las partes'}.

El plazo comenzará a correr a partir del día siguiente hábil a la confirmación
del anticipo establecido en la cláusula 5. Retrasos causados por falta de
información o aprobaciones del Cliente no serán imputables al Prestador.


5. VALOR TOTAL Y ESTRUCTURA DE PAGO

Valor total del proyecto: ${f.totalAmount || '0'} ${f.currency || 'USD'}

Estructura de pago: ${f.paymentStructure || '50% al inicio, 50% al entregar'}

   - Anticipo (${advancePct}%): ${advanceAmt} ${f.currency || 'USD'}  exigible antes del inicio de los trabajos.
   - Saldo (${100 - Number(advancePct)}%): ${balanceAmt} ${f.currency || 'USD'}  exigible contra entrega y aprobación final.

El incumplimiento del pago del anticipo en un plazo de 5 días hábiles desde
la firma de este contrato facultará al Prestador a no iniciar los trabajos
sin que ello constituya incumplimiento contractual.


6. REVISIONES Y APROBACIONES

Están incluidas: ${f.revisions || '2 rondas de revisión incluidas'}.

Cada ronda de revisión deberá consolidarse en un único documento de comentarios.
Las revisiones adicionales más allá de las incluidas serán cotizadas a tarifa
horaria del Prestador y deberán aprobarse por escrito antes de ejecutarse.


7. DERECHOS DE PROPIEDAD INTELECTUAL Y CESIÓN

${f.intellectualProperty || 'Derechos ceden al cliente al recibir pago total'}.

Hasta que el pago total del proyecto sea acreditado en la cuenta del Prestador,
todos los derechos de propiedad intelectual sobre el trabajo producido
permanecen en poder del Prestador. Ningún uso, distribución o modificación
del trabajo está autorizado antes de dicho momento.

El Prestador conserva el derecho de incluir el proyecto en su portafolio
profesional salvo instrucción escrita en contrario del Cliente.


8. CONFIDENCIALIDAD Y NO DIVULGACIÓN
${f.confidentiality ? `
Ambas partes acuerdan mantener estricta confidencialidad sobre la información
técnica, comercial y estratégica intercambiada durante la ejecución de este
contrato. Esta obligación se mantiene vigente por un período de 2 años
después de la terminación del contrato.
` : `
Las partes no han acordado una cláusula de confidencialidad específica para
este contrato. Cualquier información sensible compartida queda sujeta a las
obligaciones generales de buena fe.
`}
${f.nonCompete ? `
9. NO COMPETENCIA Y NO SOLICITACIÓN

Durante la vigencia de este contrato y por un período de 12 meses posteriores
a su terminación, el Cliente se compromete a no contratar directamente,
ni a través de terceros, a los colaboradores, subcontratistas o empleados
que el Prestador haya involucrado en este proyecto.


` : ''}
${f.nonCompete ? '10' : '9'}. LIMITACIÓN DE RESPONSABILIDAD

La responsabilidad total del Prestador bajo este contrato no podrá exceder
el valor total pagado por el Cliente. El Prestador no será responsable por
daños indirectos, lucro cesante o pérdidas consecuentes de ninguna naturaleza.


${f.nonCompete ? '11' : '10'}. CAUSALES DE TERMINACIÓN ANTICIPADA

Cualquiera de las partes podrá terminar este contrato con 10 días hábiles de
aviso escrito. En caso de terminación por parte del Cliente, los pagos realizados
hasta esa fecha no serán reembolsables y el trabajo producido hasta ese momento
permanecerá en poder del Prestador hasta la liquidación final.

En caso de incumplimiento grave por parte del Prestador, el Cliente podrá
exigir la devolución proporcional del anticipo por trabajo no entregado.


${f.nonCompete ? '12' : '11'}. RESOLUCIÓN DE CONFLICTOS Y JURISDICCIÓN

Las partes acuerdan resolver cualquier controversia derivada de este contrato
mediante mediación directa en primera instancia. De no llegarse a un acuerdo
en un plazo de 15 días, las disputas se someterán a los tribunales competentes
de ${f.jurisdiction || 'la jurisdicción pactada'}, renunciando las partes a cualquier
otro fuero que pudiera corresponderles.


${f.nonCompete ? '13' : '12'}. DISPOSICIONES GENERALES Y MODIFICACIONES

Cualquier modificación a este contrato deberá realizarse por escrito y ser
firmada por ambas partes. La nulidad de alguna cláusula no afecta la validez
del resto del contrato. Este documento constituye el acuerdo completo entre
las partes y reemplaza cualquier comunicación verbal o escrita previa.
${f.extraClauses ? `
CLÁUSULAS ADICIONALES ACORDADAS:
${f.extraClauses}
` : ''}

${f.nonCompete ? '14' : '13'}. FIRMAS Y ACEPTACIÓN

En señal de conformidad con todos los términos y condiciones establecidos en
el presente contrato, las partes lo suscriben en la fecha indicada.


PRESTADOR DE SERVICIOS                    CLIENTE


_________________________________         _________________________________
${(f.freelancerName || 'Nombre del Freelancer').padEnd(33)}${f.clientName || 'Nombre del Cliente'}
${(f.freelancerRole || 'Profesional Independiente').padEnd(33)}${f.clientCompany || 'Cliente'}
${(f.freelancerEmail || '').padEnd(33)}${f.clientEmail || ''}

Firma: _________________________          Firma: _________________________

Fecha:  _________________________         Fecha:  _________________________


Contrato generado con Contractly · contractly.app
[MODO DEMO  Active ANTHROPIC_API_KEY para contratos reales con IA]`
}

//  Handler 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { formData } = req.body
  if (!formData) return res.status(400).json({ error: 'Missing form data' })

  //  DEMO MODE: no API key configured 
console.log("API KEY:", process.env.ANTHROPIC_API_KEY)
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.trim() === '') {
    // Simulate a short generation delay so the UX loading state shows
    await new Promise(r => setTimeout(r, 1800))
    return res.status(200).json({
      contract: buildDemoContract(formData),
      demo: true,
    })
  }

  //  PRODUCTION MODE: use Anthropic 
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
Nunca uses placeholders genéricos  usa siempre los datos reales proporcionados.
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
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const text = message.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')

    return res.status(200).json({ contract: text, tokens: message.usage })
  } catch (err: any) {
    console.error('Anthropic error:', err)
    return res.status(500).json({ error: err.message || 'Error al generar el contrato' })
  }
}
