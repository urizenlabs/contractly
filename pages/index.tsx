import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  Shield, Zap, Download, Globe, Check, ChevronDown,
  FileText, Star, AlertCircle, ArrowRight, Clock,
  TrendingUp, Users, Lock, RefreshCw, MessageSquare,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import PricingCard from '../components/PricingCard'
import { PLANS } from '../lib/pricing'
import { PricingPlan } from '../lib/types'
import toast from 'react-hot-toast'

// ─── Data ────────────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  'El cliente dice que "solo era una cosa más" y el proyecto se triplicó',
  'Terminaste el trabajo y el cliente desapareció con el 50% sin pagar',
  'No tienes nada firmado y ahora no sabes si demandar o simplemente perder',
  'Bajaste el precio "para fidelizarlo" y el proyecto se volvió pesadilla',
]

const FEATURES = [
  {
    icon: Zap,
    title: 'De formulario a contrato en 90 segundos',
    desc: 'Sin abogados, sin plantillas de Word desactualizadas. Describes el proyecto, defines las condiciones y la IA redacta 13 cláusulas legales a medida.',
    highlight: '90 seg',
  },
  {
    icon: Shield,
    title: 'Cláusulas que realmente te protegen',
    desc: 'Propiedad intelectual, anticipo obligatorio, límite de revisiones, confidencialidad y cláusula anti-scope creep. Todo lo que un abogado te cobraría $300 por redactar.',
    highlight: '13 cláusulas',
  },
  {
    icon: Download,
    title: 'PDF listo para enviar al cliente hoy',
    desc: 'Descarga un documento con tu nombre, los datos del cliente, las condiciones pactadas y espacios de firma. Profesional desde el primer proyecto.',
    highlight: 'PDF inmediato',
  },
  {
    icon: Globe,
    title: 'Adaptado a las leyes de tu país',
    desc: 'Ecuador, México, Colombia, Argentina, Chile, Perú, España y más. No es una plantilla gringa traducida al español: respeta la jurisdicción que eliges.',
    highlight: '8+ países',
  },
]

const WHY_CONTRACTLY = [
  {
    icon: TrendingUp,
    title: 'Cobra el anticipo antes de empezar',
    desc: 'El 68% de los freelancers han trabajado sin cobrar al menos una vez. Un contrato firmado con anticipo del 50% cambia esa estadística para siempre.',
    stat: '68% de freelancers han trabajado gratis alguna vez',
  },
  {
    icon: RefreshCw,
    title: 'Pon límite a las revisiones infinitas',
    desc: '"Una cosita más" es la frase más cara del español freelance. Con la cláusula de revisiones de Contractly, la tercera vuelta tiene precio.',
    stat: 'Proyectos sin contrato toman 2.4x más tiempo del estimado',
  },
  {
    icon: Lock,
    title: 'El código es tuyo hasta el último pago',
    desc: 'La cláusula de propiedad intelectual de Contractly establece que los derechos solo se transfieren al cliente cuando el pago total está acreditado en tu cuenta.',
    stat: 'Sin esta cláusula, el cliente puede usar tu trabajo sin pagarte',
  },
  {
    icon: MessageSquare,
    title: 'Resuelve conflictos antes de que ocurran',
    desc: 'Un contrato claro elimina el 90% de las discusiones. El 10% restante lo resuelve la cláusula de arbitraje. Nunca más una conversación incómoda sobre "lo que acordamos".',
    stat: 'Los freelancers con contrato cobran a tiempo 3x más',
  },
]

const TESTIMONIALS = [
  {
    name: 'Andrea Morales',
    role: 'Diseñadora UX · México',
    avatar: 'AM',
    avatarColor: 'bg-violet-100 text-violet-600',
    text: 'Generé un contrato para un proyecto de $4,800 en 2 minutos. El cliente lo firmó ese mismo día. Antes de Contractly, le mandaba un PDF de Word que daba vergüenza.',
    stars: 5,
    metric: 'Ahorró 3 horas de redacción',
  },
  {
    name: 'Carlos Vega',
    role: 'Dev Full-Stack · Colombia',
    avatar: 'CV',
    avatarColor: 'bg-blue-100 text-blue-600',
    text: 'A la mitad del proyecto el cliente pidió "agregar un módulo rápido". Abrí el contrato, señalé la cláusula de alcance y me dijo: "ok, cómo lo cotizamos". Game changer.',
    stars: 5,
    metric: 'Cobró $1,200 en trabajo adicional',
  },
  {
    name: 'Sofía Rendón',
    role: 'Consultora de Marketing · Ecuador',
    avatar: 'SR',
    avatarColor: 'bg-rose-100 text-rose-600',
    text: 'El anticipo del 50% que dice el contrato me salvó cuando el cliente cerró su empresa. Cobré la mitad. Sin contrato, hubiera perdido 3 meses de trabajo.',
    stars: 5,
    metric: 'Recuperó $2,100 que hubiera perdido',
  },
]

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Ingresa tus datos y los del cliente',
    desc: 'Nombre, email, país. Nada más. En 20 segundos.',
    time: '20 seg',
  },
  {
    n: '02',
    title: 'Describe el proyecto y los entregables',
    desc: 'Qué harás, qué entregarás, cuántas revisiones incluyes.',
    time: '30 seg',
  },
  {
    n: '03',
    title: 'Define monto, anticipo y plazo',
    desc: 'La IA calcula las cláusulas de pago automáticamente.',
    time: '20 seg',
  },
  {
    n: '04',
    title: 'Descarga el PDF y envíalo hoy',
    desc: 'Profesional, firmable, adaptado a tu jurisdicción.',
    time: '5 seg',
  },
]

const FAQS = [
  {
    q: '¿El contrato tiene validez legal real?',
    a: 'Sí. Contractly genera contratos de servicios profesionales que respetan los principios del derecho civil de cada jurisdicción seleccionada (Ecuador, México, Colombia, Argentina, España y más). Para proyectos superiores a $10,000 siempre recomendamos una revisión adicional por un abogado local, pero para el 95% de los proyectos freelance, este contrato es completamente válido y ejecutable.',
  },
  {
    q: '¿Qué pasa si el cliente no quiere firmar?',
    a: 'Un cliente que se niega a firmar un contrato es una señal de alerta seria. Contractly te ayuda a identificar ese momento antes de empezar. Si el cliente no firma, tienes dos opciones: trabajar de todas formas (y arriesgarte) o pedir por adelantado (y protegerte). El contrato te da el argumento profesional para exigir la firma sin parecer desconfiado.',
  },
  {
    q: '¿Puedo editar el contrato después de generarlo?',
    a: 'Sí. El PDF se genera con texto completo que puedes copiar y pegar en Word, Google Docs o cualquier editor. Puedes modificar cualquier cláusula antes de enviarlo. Con el plan Pro, puedes regenerar con nuevos parámetros cuantas veces quieras.',
  },
  {
    q: '¿Funciona para agencias y pequeñas empresas, no solo freelancers?',
    a: 'Totalmente. El formulario permite ingresar nombre de empresa, razón social y RFC/RUT/NIT según el país. El contrato resultante es apto para relaciones B2B entre empresas, no solo entre persona física y cliente.',
  },
  {
    q: '¿Mis datos y los de mis clientes están seguros?',
    a: 'Contractly no almacena los datos del contrato en ningún servidor. Todo el procesamiento ocurre en el momento de generación y el resultado se entrega directamente a tu dispositivo. No creamos base de datos con tus clientes, montos ni proyectos.',
  },
  {
    q: '¿Puedo cancelar el plan Pro cuando quiera?',
    a: 'Sí, con un clic desde tu portal de Stripe. Sin período mínimo, sin penalización, sin llamadas para "retención". Si cancelas en día 15, dejas de ser cobrado desde ese momento.',
  },
  {
    q: '¿Funciona para proyectos de larga duración o retainer mensual?',
    a: 'Sí. En el formulario puedes seleccionar "Pago mensual (proyecto largo plazo)" como estructura de pago. La IA genera una cláusula de retainer con condiciones de renovación, cancelación anticipada y entregables mensuales.',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Landing() {
  const [openFaq, setOpenFaq]     = useState<number | null>(null)
  const [payLoading, setPayLoading] = useState<string | null>(null)
  const [activePain, setActivePain] = useState(0)

  // Rotate pain points every 3.5s
  useEffect(() => {
    const t = setInterval(() => setActivePain(p => (p + 1) % PAIN_POINTS.length), 3500)
    return () => clearInterval(t)
  }, [])

  async function handlePlanSelect(plan: PricingPlan) {
    setPayLoading(plan.id)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (e: any) {
      toast.error('Error al iniciar el pago. Inténtalo de nuevo.')
      setPayLoading(null)
    }
  }

  return (
    <>
      <Head>
        <title>Contractly · Protege tu trabajo freelance con contratos reales en 60 segundos</title>
        <meta name="description" content="Genera contratos freelance con IA en menos de 2 minutos. 13 cláusulas legales, anticipo protegido, cláusula anti-scope creep. PDF listo para firmar. Para freelancers y agencias de LATAM." />
        <meta property="og:title" content="Contractly · Contratos freelance en 60 segundos" />
        <meta property="og:description" content="Deja de trabajar sin contrato. Genera uno profesional en 60 segundos, desde $9." />
      </Head>

      <div className="min-h-screen bg-white overflow-x-hidden">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pt-14 pb-12 sm:pt-20 sm:pb-16">

          {/* Pain agitator — rotating */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium leading-snug min-h-[40px] transition-all duration-500">
                {PAIN_POINTS[activePain]}
              </p>
            </div>
            <p className="text-center text-xs text-ink-400 mt-2">
              Situaciones reales que los contratos previenen. ¿Te suena alguna?
            </p>
          </div>

          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-100 mb-5">
              <Zap size={11} />
              Únete a +2,400 freelancers que ya cobran con contrato
            </div>

            {/* H1 */}
            <h1 className="text-[2rem] sm:text-[3.2rem] font-bold text-ink-900 leading-[1.1] mb-5 tracking-tight px-2">
              Deja de trabajar<br />
              <span className="text-brand-500">sin contrato</span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-ink-500 max-w-lg mx-auto mb-3 leading-relaxed px-2">
              Contractly genera contratos freelance profesionales con IA en menos de 2 minutos.
              Con anticipo, cláusula de scope y propiedad intelectual. Descarga el PDF y envíalo hoy.
            </p>

            {/* Value prop */}
            <p className="text-sm text-ink-400 mb-8">
              Un abogado cobra <span className="line-through">$300+</span> por esto.&nbsp;
              <strong className="text-ink-700">Contractly lo hace por $9.</strong>
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
              <Link
                href="/app"
                className="w-full sm:w-auto btn-primary text-base px-8 py-3.5 rounded-xl shadow-lg shadow-brand-200 justify-center"
              >
                Protege tu próximo proyecto →
              </Link>
              <Link
                href="#como-funciona"
                className="text-sm text-ink-500 hover:text-ink-700 transition-colors flex items-center gap-1"
              >
                Ver cómo funciona <ChevronDown size={14} />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-ink-400">
              <span className="flex items-center gap-1"><Check size={11} className="text-green-500" /> Sin registro obligatorio</span>
              <span className="flex items-center gap-1"><Check size={11} className="text-green-500" /> PDF listo en 60 segundos</span>
              <span className="flex items-center gap-1"><Check size={11} className="text-green-500" /> Reembolso en 7 días</span>
            </div>
          </div>

          {/* Preview card — mobile-optimized */}
          <div className="mt-12 mx-auto w-full max-w-lg bg-white border border-ink-200 rounded-2xl shadow-xl shadow-ink-100/50 overflow-hidden text-left">
            <div className="bg-brand-500 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={13} color="white" />
                <span className="text-white text-xs font-medium">Contrato generado · PDF listo</span>
              </div>
              <span className="text-white/60 text-[10px] hidden sm:block">contractly.app</span>
            </div>
            <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs text-ink-700 leading-relaxed">
              <p className="font-bold text-ink-900 text-xs sm:text-sm mb-2">CONTRATO DE SERVICIOS PROFESIONALES</p>
              <p className="text-ink-400 mb-3 text-[10px] sm:text-xs">
                Guayaquil, Ecuador · {new Date().toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}
              </p>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-ink-800 mb-0.5">1. IDENTIFICACIÓN DE LAS PARTES</p>
                  <p>Prestador: <span className="text-brand-600 font-medium">María García</span> · Diseñadora UX</p>
                  <p>Cliente: <span className="text-brand-600 font-medium">TechStartup SA</span> · hola@techstartup.com</p>
                </div>
                <div>
                  <p className="font-semibold text-ink-800 mb-0.5">5. VALOR Y FORMA DE PAGO</p>
                  <p className="text-ink-600">Valor total: <strong className="text-ink-900">$2,500 USD</strong>. Anticipo del 50% ($1,250) exigible antes del inicio. El saldo restante se pagará contra entrega y aprobación…</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-ink-100 flex flex-wrap gap-1.5">
                {['✓ Propiedad intelectual', '✓ NDA', '✓ Anti-scope creep', '✓ +10 cláusulas'].map(t => (
                  <span key={t} className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────────── */}
        <section className="bg-ink-900 py-6">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 text-center">
            {[
              { n: '+2,400', lbl: 'contratos generados' },
              { n: '$0',     lbl: 'en honorarios de abogado' },
              { n: '8',      lbl: 'países de LATAM' },
              { n: '<2 min', lbl: 'de formulario a PDF' },
            ].map(s => (
              <div key={s.n} className="px-4 sm:border-r sm:border-white/10 last:border-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{s.n}</p>
                <p className="text-[11px] text-white/50 mt-0.5">{s.lbl}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">Qué incluye</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-3">
              Todo lo que un abogado pondría.<br className="hidden sm:block" /> Sin la cuenta de honorarios.
            </h2>
            <p className="text-ink-500 text-sm sm:text-base max-w-md mx-auto">
              No es una plantilla genérica. La IA redacta cada cláusula con los datos reales de tu proyecto.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-5 sm:p-6 hover:border-brand-200 hover:shadow-md hover:shadow-brand-50 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <f.icon size={19} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-semibold text-ink-900 text-sm sm:text-base leading-tight">{f.title}</h3>
                      <span className="text-[10px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                        {f.highlight}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY CONTRACTLY ────────────────────────────────────────────── */}
        <section className="bg-ink-50 border-y border-ink-100 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">¿Por qué Contractly?</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-3">
                Porque trabajar sin contrato<br className="hidden sm:block" /> es trabajar gratis en modo diferido
              </h2>
              <p className="text-sm sm:text-base text-ink-500 max-w-md mx-auto">
                Estos no son argumentos de ventas. Son las razones reales por las que los freelancers pierden dinero cada semana.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {WHY_CONTRACTLY.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-ink-100 p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={17} className="text-brand-500" />
                    </div>
                    <h3 className="font-semibold text-ink-900 text-sm sm:text-base leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-600 leading-relaxed mb-3">{item.desc}</p>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <p className="text-[11px] text-amber-700 font-medium leading-snug">⚠ {item.stat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section id="como-funciona" className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">Cómo funciona</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-3">De cero a contrato firmable en 4 pasos</h2>
            <p className="text-sm text-ink-500">Sin cuenta, sin esperas, sin abogados.</p>
          </div>
          <div className="relative">
            {/* Vertical line connector (desktop) */}
            <div className="absolute left-[19px] top-10 bottom-10 w-px bg-brand-100 hidden sm:block" />
            <div className="space-y-5">
              {HOW_IT_WORKS.map((s, i) => (
                <div key={s.n} className="flex gap-4 sm:gap-5 items-start relative">
                  <div className="w-10 h-10 flex-shrink-0 bg-brand-500 text-white rounded-xl flex items-center justify-center font-mono text-sm font-bold shadow-md shadow-brand-200 z-10">
                    {s.n}
                  </div>
                  <div className="flex-1 bg-white border border-ink-100 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-ink-900 text-sm sm:text-base">{s.title}</p>
                      <span className="text-[10px] font-bold text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                        {s.time}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/app" className="btn-primary px-7 py-3 text-sm rounded-xl shadow-md shadow-brand-200">
              Empezar ahora — es gratis probar <ArrowRight size={15} />
            </Link>
            <p className="text-xs text-ink-400 mt-2">Pagas solo cuando descargas el contrato.</p>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
        <section className="bg-ink-900 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-2">Testimonios</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Lo que dicen quienes ya cobran con contrato
              </h2>
              <p className="text-white/40 text-xs">
                * Testimonios ilustrativos basados en situaciones reales del mercado freelance de LATAM.
                Pronto publicaremos reseñas verificadas de usuarios reales.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-4 flex-1">"{t.text}"</p>
                  {/* Metric callout */}
                  <div className="bg-brand-500/20 border border-brand-400/30 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-brand-300 font-semibold">{t.metric}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${t.avatarColor} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-[11px] text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        <section id="pricing" className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">Precios</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-3">
                Menos de lo que cobras por una hora de trabajo
              </h2>
              <p className="text-sm sm:text-base text-ink-500">
                Un contrato que protege $2,000 cuesta $9. La cuenta es fácil.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
              {PLANS.map(plan => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  onSelect={handlePlanSelect}
                  loading={payLoading === plan.id}
                />
              ))}
            </div>
            <div className="mt-8 text-center space-y-2">
              <p className="text-xs text-ink-400">
                🔒 Pago seguro con Stripe · Sin datos de tarjeta almacenados en nuestro servidor
              </p>
              <p className="text-xs text-ink-400">
                💳 Reembolso completo en 7 días si el contrato no cumple tus expectativas. Sin preguntas.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="bg-ink-50 border-y border-ink-100 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">FAQ</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-3">Preguntas frecuentes</h2>
              <p className="text-sm text-ink-500">Las cosas que quieres saber antes de comprar. Aquí están, con respuestas honestas.</p>
            </div>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-ink-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-start sm:items-center justify-between px-5 py-4 text-left gap-3"
                  >
                    <span className="text-sm font-medium text-ink-900 leading-snug">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-ink-400 flex-shrink-0 mt-0.5 sm:mt-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-ink-50">
                      <p className="text-sm text-ink-500 leading-relaxed pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-2xl mx-auto bg-brand-500 rounded-3xl px-6 sm:px-12 py-12 sm:py-14 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative z-10">
              <p className="text-brand-100 text-xs font-semibold uppercase tracking-widest mb-3">
                Último paso
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                Tu próximo cliente merece<br />un contrato firmado
              </h2>
              <p className="text-brand-100/80 text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
                En el tiempo que tardas en escribir un email, generas un contrato que protege tu trabajo, tu tiempo y tu dinero.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors text-base shadow-lg"
                >
                  Generar mi contrato ahora <ArrowRight size={16} />
                </Link>
              </div>
              <p className="text-brand-200/60 text-xs mt-4">
                Desde $9 · PDF inmediato · Sin registro previo
              </p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <footer className="border-t border-ink-100 py-8">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
              <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
                <FileText size={12} color="white" />
              </div>
              Contractly
              <span className="text-ink-300 font-normal text-xs ml-1">· Hecho para freelancers de LATAM</span>
            </div>
            <p className="text-xs text-ink-300">© {new Date().getFullYear()} Contractly. Todos los derechos reservados.</p>
            <div className="flex gap-5 text-xs text-ink-400">
              <a href="#" className="hover:text-ink-600 transition-colors">Términos de uso</a>
              <a href="#" className="hover:text-ink-600 transition-colors">Privacidad</a>
              <a href="mailto:hola@contractly.app" className="hover:text-ink-600 transition-colors">Contacto</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
