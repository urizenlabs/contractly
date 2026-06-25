import { ContractFormData } from './types'

export async function generatePDF(contractText: string, data: ContractFormData): Promise<void> {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginLeft = 20
  const marginRight = 20
  const marginTop = 25
  const marginBottom = 25
  const usableWidth = pageWidth - marginLeft - marginRight
  const lineHeight = 6

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(61, 110, 240)
  doc.rect(0, 0, pageWidth, 18, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('CONTRACTLY', marginLeft, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Contrato generado con IA · contractly.app', pageWidth - marginRight, 12, { align: 'right' })

  // ── Title block ──────────────────────────────────────────
  doc.setTextColor(20, 20, 19)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('CONTRATO DE SERVICIOS PROFESIONALES', pageWidth / 2, marginTop + 10, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(92, 92, 88)
  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.text(`Generado el ${today}`, pageWidth / 2, marginTop + 17, { align: 'center' })

  // ── Divider ──────────────────────────────────────────────
  doc.setDrawColor(217, 217, 213)
  doc.setLineWidth(0.3)
  doc.line(marginLeft, marginTop + 21, pageWidth - marginRight, marginTop + 21)

  // ── Summary box ──────────────────────────────────────────
  let yPos = marginTop + 27
  doc.setFillColor(240, 244, 255)
  doc.roundedRect(marginLeft, yPos, usableWidth, 22, 3, 3, 'F')

  doc.setTextColor(41, 82, 214)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('PARTES DEL CONTRATO', marginLeft + 4, yPos + 6)

  doc.setTextColor(20, 20, 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Prestador: ${data.freelancerName} · ${data.freelancerRole}`, marginLeft + 4, yPos + 12)
  doc.text(`Cliente: ${data.clientName}${data.clientCompany ? ' · ' + data.clientCompany : ''}`, marginLeft + 4, yPos + 18)

  // Right side of summary
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(41, 82, 214)
  doc.text(`${Number(data.totalAmount).toLocaleString()} ${data.currency}`, pageWidth - marginRight - 4, yPos + 12, { align: 'right' })
  doc.setTextColor(92, 92, 88)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(data.deadline, pageWidth - marginRight - 4, yPos + 18, { align: 'right' })

  yPos += 28

  // ── Body text ────────────────────────────────────────────
  doc.setTextColor(20, 20, 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)

  // ── Sanitize contract text before rendering ───────────────
  // ROOT CAUSE OF %P BUG: jsPDF standard fonts (Helvetica) only support
  // WinAnsi encoding (latin-1, U+0000–U+00FF). Characters outside this range
  // — such as ═ (U+2550, box-drawing) — get mis-encoded: U+2550 maps to byte
  // 0x50 = ASCII 'P', and the encoding error prefix produces literal '%P' in
  // the rendered PDF. Fix: replace every non-latin-1 character before rendering.
  function sanitizeForPDF(text: string): string {
    return text
      // Box-drawing separators used in demo template → plain dashes
      .replace(/[═━─]+/g, '-'.repeat(60))
      // Any remaining non-latin-1 character → strip
      .replace(/[^\x00-\xFF]/g, '')
      // Strip leading duplicate title block (demo template includes it)
      .replace(/^CONTRATO DE SERVICIOS PROFESIONALES[^\n]*\n(\[MODO DEMO[^\]]*\]\n)?(Fecha:[^\n]*\n)?/, '')
      // Strip [MODO DEMO ...] line wherever it appears
      .replace(/^\[MODO DEMO[^\]]*\]\s*\n?/m, '')
  }

  const lines = sanitizeForPDF(contractText).split('\n')

  for (const rawLine of lines) {
    const line = rawLine.trim()

    // Check page overflow
    if (yPos > pageHeight - marginBottom) {
      doc.addPage()
      yPos = marginTop

      // Minimal header on continuation pages
      doc.setFillColor(61, 110, 240)
      doc.rect(0, 0, pageWidth, 10, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.text('CONTRACTLY · Contrato de Servicios Profesionales', marginLeft, 7)
      doc.setTextColor(20, 20, 19)
      yPos = 20
    }

    if (!line) {
      yPos += lineHeight * 0.4
      continue
    }

    // Separator lines (===... or ---...) → elegant thin rule instead of text
    if (/^[=\-]{10,}$/.test(line)) {
      yPos += 3
      doc.setDrawColor(217, 217, 213)
      doc.setLineWidth(0.3)
      doc.line(marginLeft, yPos, pageWidth - marginRight, yPos)
      yPos += 5
      continue
    }

    // Section headers (e.g. "1. TÍTULO")
    const isHeader = /^\d+[\.\-]/.test(line) || /^[A-ZÁÉÍÓÚÑ\s]{8,}$/.test(line)

    if (isHeader) {
      yPos += 3
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(30, 61, 176)
      const wrapped = doc.splitTextToSize(line, usableWidth)
      doc.text(wrapped, marginLeft, yPos)
      yPos += wrapped.length * lineHeight + 1
      doc.setTextColor(20, 20, 19)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
    } else {
      const wrapped = doc.splitTextToSize(line, usableWidth)
      doc.text(wrapped, marginLeft, yPos)
      yPos += wrapped.length * lineHeight
    }
  }

  // ── Footer ──────────────────────────────────────────────
  const totalPages = (doc.internal as any).getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(248, 248, 247)
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(158, 158, 152)
    doc.text(`Página ${i} de ${totalPages} · Generado con Contractly · contractly.app`, pageWidth / 2, pageHeight - 4, { align: 'center' })
  }

  // Trigger download
  const fileName = `contrato-${data.clientName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`
  doc.save(fileName)
}
