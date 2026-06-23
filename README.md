# Contractly — Generador de Contratos Freelance con IA

> Genera contratos profesionales en 60 segundos. Listo para producción.

---

## Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **IA**: Anthropic Claude Opus (claude-opus-4-6)
- **Pagos**: Stripe Checkout (pago único + suscripción)
- **PDF**: jsPDF (generación client-side, sin servidor)
- **Deploy**: Vercel (recomendado)

---

## Setup local

```bash
# 1. Clonar e instalar
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# → Edita .env.local con tus keys reales

# 3. Correr en desarrollo
npm run dev
# → http://localhost:3000
```

---

## Variables de entorno requeridas

| Variable | Dónde obtenerla |
|----------|----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Crear endpoint → `tu-dominio/api/webhook` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → API Keys (publishable) |
| `NEXT_PUBLIC_APP_URL` | Tu dominio en producción (ej: `https://contractly.app`) |

---

## Deploy en Vercel (recomendado)

```bash
# Opción A: CLI
npx vercel --prod

# Opción B: GitHub
# 1. Push a GitHub
# 2. Importar en vercel.com
# 3. Agregar las variables de entorno en Settings → Environment Variables
```

### Configurar Stripe Webhook en producción

1. Ir a [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Crear endpoint: `https://tu-dominio.com/api/webhook`
3. Seleccionar eventos:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
4. Copiar el `Signing secret` → `STRIPE_WEBHOOK_SECRET`

---

## Estructura de archivos

```
contractly/
├── pages/
│   ├── index.tsx          # Landing page
│   ├── app.tsx            # Generador (flujo de 4 pasos)
│   ├── success.tsx        # Post-pago
│   ├── _app.tsx
│   ├── _document.tsx
│   └── api/
│       ├── generate.ts    # Anthropic → genera contrato
│       ├── checkout.ts    # Stripe → crea sesión de pago
│       └── webhook.ts     # Stripe → eventos post-pago
├── components/
│   ├── Navbar.tsx
│   ├── StepIndicator.tsx
│   ├── FormField.tsx
│   ├── Step1.tsx          # Partes del contrato
│   ├── Step2.tsx          # Descripción del proyecto
│   ├── Step3.tsx          # Condiciones económicas y legales
│   ├── ContractOutput.tsx # Vista del contrato + descarga PDF
│   ├── PaywallModal.tsx   # Modal de pago
│   └── PricingCard.tsx
├── lib/
│   ├── types.ts           # TypeScript types
│   ├── validation.ts      # Validación por paso
│   ├── pdf.ts             # Generación de PDF con jsPDF
│   └── pricing.ts         # Planes y precios
├── styles/
│   └── globals.css
├── public/
│   └── favicon.svg
├── vercel.json
├── .env.example
└── README.md
```

---

## Modelo de negocio

| Plan | Precio | Stripe Mode |
|------|--------|-------------|
| Un contrato | $9 USD | `payment` (pago único) |
| Pro mensual | $19 USD/mes | `subscription` |

### Revenue estimado
- 10 contratos/día × $9 = **$90/día → $2,700/mes**
- 50 suscriptores Pro × $19 = **$950/mes adicional**
- Meta mes 1: **$3,650 MRR**

---

## Canales de distribución (semana 1)

1. **Reddit**: r/freelance, r/webdev, r/Entrepreneur (post con demo real)
2. **Twitter/X**: Hilo mostrando el antes/después (sin contrato vs con contrato)
3. **LinkedIn**: Post dirigido a freelancers y consultores
4. **ProductHunt**: Launch el martes o miércoles
5. **Grupos Facebook**: Grupos de freelancers LATAM (30+ grupos activos)
6. **TikTok**: Demo en 60 segundos generando un contrato real

---

## Próximos features (post-lanzamiento)

- [ ] Firma digital integrada (DocuSign / HelloSign API)
- [ ] Historial de contratos (base de datos)
- [ ] Plantillas por industria
- [ ] Email automático al cliente con el contrato
- [ ] Recordatorios de pago
- [ ] Multi-idioma automático

---

## Licencia

Propietario · Todos los derechos reservados · Contractly 2024
