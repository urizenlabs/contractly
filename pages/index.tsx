import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Shield, Zap, Download, Globe, Check, ChevronDown, FileText, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import PricingCard from '../components/PricingCard'
import { PLANS } from '../lib/pricing'
import { PricingPlan } from '../lib/types'
import toast from 'react-hot-toast'

const FEATURES = [
  {
    icon: Zap,
    title: 'Listo en 60 segundos',
    desc: 'Completa 3 pasos simples y la IA genera un contrato completo al instante.',
  },
  {
    icon: Shield,
    title: '13 cláusulas legales',
    desc: 'Propiedad intelectual, pagos, confidencialidad, resolución de conflictos y más.',
  },
  {
    icon: Download,
    title: 'PDF listo para firmar',
    desc: 'Descarga un PDF profesional formateado, con espacios de firma incluidos.',
  },
  {
    icon: Globe,
    title: 'Para toda Latinoamérica',
    desc: 'Adaptado a las leyes de Ecuador, México, Colombia, Argentina, España y más.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Andrea Morales',
    role: 'Diseñadora UX Freelance · México',
    text: 'Me tomó 90 segundos generar un contrato para un proyecto de $5,000. Antes tardaba horas con plantillas que igual no me convencían.',
    stars: 5,
  },
  {
    name: 'Carlos Vega',
    role: 'Desarrollador Full-Stack · Colombia',
    text: 'El cliente intentó cambiar el scope a la mitad del proyecto. Saqué el contrato, lo leímos juntos, y se resolvió en 5 minutos.',
    stars: 5,
  },
  {
    name: 'Luisa Paredes',
    role: 'Consultora de Marketing · Ecuador',
    text: 'Por fin tengo contratos profesionales sin pagar a un abogado cada vez. El PDF queda perfecto para enviarlo por email.',
    stars: 5,
  },
]

const FAQS = [
  {
    q: '¿Son los contratos legalmente válidos?',
    a: 'Sí. Los contratos generados siguen los principios legales de cada jurisdicción seleccionada. Para proyectos de muy alto valor, siempre recomendamos una revisión adicional por un abogado local.',
  },
  {
    q: '¿Puedo editar el contrato después de generarlo?',
    a: 'Puedes copiar el texto y editarlo en cualquier procesador de texto, o volver a generar con diferentes parámetros. El plan Pro incluye regeneraciones ilimitadas.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. No almacenamos los datos de tu contrato en servidores. El contrato se genera y se entrega directamente a tu dispositivo.',
  },
  {
    q: '¿Funciona para todo tipo de servicios digitales?',
    a: 'Funciona para desarrollo web, diseño, marketing, consultoría, video, redacción de contenido, fotografía y más. Si tu servicio no aparece en la lista, puedes escribirlo manualmente.',
  },
  {
    q: '¿Puedo cancelar el plan Pro en cualquier momento?',
    a: 'Sí, cancelas con un clic desde tu portal de Stripe. No hay permanencia ni penalizaciones.',
  },
]

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [payLoading, setPayLoading] = useState<string | null>(null)

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
      toast.error('Error: ' + e.message)
    } finally {
      setPayLoading(null)
    }
  }

  return (
    <>
      <Head>
        <title>Contractly · Contratos freelance con IA en 60 segundos</title>
        <meta name="description" content="Genera contratos freelance profesionales con 13 cláusulas legales en menos de un minuto. Exporta a PDF. Válido en toda Latinoamérica." />
      </Head>

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-100 mb-6">
            <Zap size={12} />
            Nuevo: exportación a PDF con un clic
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-ink-900 leading-tight mb-5 tracking-tight">
            Tu contrato freelance,<br />
            <span className="text-brand-500">listo en 60 segundos</span>
          </h1>

          <p className="text-lg text-ink-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Genera contratos profesionales con IA. 13 cláusulas legales,
            adaptado a tu jurisdicción, exportable a PDF. <strong className="text-ink-700">Nunca más trabajes sin contrato.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/app" className="btn-primary text-base px-6 py-3">
              Generar mi contrato →
            </Link>
            <span className="text-sm text-ink-400">Desde $9 · Sin suscripción obligatoria</span>
          </div>

          {/* Preview card */}
          <div className="max-w-xl mx-auto bg-white border border-ink-200 rounded-2xl shadow-xl shadow-ink-100/60 overflow-hidden text-left">
            <div className="bg-brand-500 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={15} color="white" />
                <span className="text-white text-sm font-medium">Contrato generado</span>
              </div>
              <span className="text-white/70 text-xs">contractly.app</span>
            </div>
            <div className="p-5 font-mono text-xs text-ink-700 leading-relaxed">
              <p className="font-bold text-ink-900 text-sm mb-3">CONTRATO DE SERVICIOS PROFESIONALES</p>
              <p className="text-ink-500 mb-3">Guayaquil, Ecuador · {new Date().toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}</p>
              <p className="mb-2"><span className="font-semibold">1. IDENTIFICACIÓN DE LAS PARTES</span></p>
              <p className="mb-1">Prestador: <span className="text-brand-600">María García</span> · Diseñadora UX</p>
              <p className="mb-3">Cliente: <span className="text-brand-600">TechStartup SA</span> · hola@techstartup.com</p>
              <p className="mb-2"><span className="font-semibold">2. OBJETO DEL CONTRATO</span></p>
              <p className="text-ink-500">La prestadora se compromete a diseñar y entregar la interfaz completa del dashboard de analytics, incluyendo…</p>
              <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-3">
                {['Propiedad intelectual', 'NDA', 'Pagos', '+10 más'].map(t => (
                  <span key={t} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Social proof ──────────────────────────────────── */}
        <section className="bg-ink-50 py-8 border-y border-ink-100">
          <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-center">
            {[
              { n: '+2,400', lbl: 'contratos generados' },
              { n: '13',     lbl: 'cláusulas legales' },
              { n: '8',      lbl: 'países soportados' },
              { n: '60s',    lbl: 'tiempo promedio' },
            ].map(s => (
              <div key={s.n} className="px-6">
                <p className="text-2xl font-bold text-ink-900">{s.n}</p>
                <p className="text-xs text-ink-500 mt-0.5">{s.lbl}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink-900 mb-3">Todo lo que necesitas en un contrato</h2>
            <p className="text-ink-500">Sin plantillas genéricas. Sin letra chica confusa. Sin abogado.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 hover:border-brand-200 transition-colors">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-brand-500" />
                </div>
                <h3 className="font-semibold text-ink-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────── */}
        <section className="bg-ink-50 border-y border-ink-100 py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-ink-900 text-center mb-12">Cómo funciona</h2>
            <div className="space-y-6">
              {[
                { n: '01', title: 'Ingresa los datos', desc: 'Nombre, cliente, descripción del proyecto. Sin formularios interminables.' },
                { n: '02', title: 'Define las condiciones', desc: 'Monto, plazos, revisiones, derechos de autor. Tú controlas todo.' },
                { n: '03', title: 'La IA genera tu contrato', desc: '13 cláusulas legales adaptadas a tu jurisdicción, listas en segundos.' },
                { n: '04', title: 'Descarga y firma', desc: 'PDF profesional listo para enviar a tu cliente y firmar hoy.' },
              ].map(s => (
                <div key={s.n} className="flex gap-5 items-start">
                  <div className="w-10 h-10 flex-shrink-0 bg-brand-500 text-white rounded-xl flex items-center justify-center font-mono text-sm font-bold">
                    {s.n}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 mb-0.5">{s.title}</p>
                    <p className="text-sm text-ink-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-ink-900 text-center mb-12">Lo que dicen los freelancers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink-700 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────── */}
        <section id="pricing" className="bg-ink-50 border-y border-ink-100 py-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-ink-900 mb-3">Precios simples y honestos</h2>
              <p className="text-ink-500">Sin sorpresas. Sin suscripciones forzadas.</p>
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
            <p className="text-center text-xs text-ink-400 mt-6">
              🔒 Pago seguro con Stripe · Reembolso en 7 días si no estás satisfecho
            </p>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-ink-900 text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-ink-900">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-ink-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-ink-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────── */}
        <section className="bg-brand-500 py-16 text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-3">¿Listo para proteger tu trabajo?</h2>
            <p className="text-brand-100 mb-8 text-lg">Tu próximo cliente merece un contrato profesional.</p>
            <Link href="/app" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition-colors">
              Crear mi primer contrato →
            </Link>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer className="border-t border-ink-100 py-8 text-center">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
              <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
                <FileText size={12} color="white" />
              </div>
              Contractly
            </div>
            <p className="text-xs text-ink-400">© 2024 Contractly · Hecho para freelancers de LATAM</p>
            <div className="flex gap-4 text-xs text-ink-400">
              <a href="#" className="hover:text-ink-600">Términos</a>
              <a href="#" className="hover:text-ink-600">Privacidad</a>
              <a href="mailto:hola@contractly.app" className="hover:text-ink-600">Contacto</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
