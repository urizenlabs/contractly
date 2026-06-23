import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Props {
  plan: string
}

export default function SuccessPage({ plan }: Props) {
  return (
    <>
      <Head><title>¡Pago exitoso! · Contractly</title></Head>
      <div className="min-h-screen bg-ink-50">
        <Navbar minimal />
        <main className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 mb-2">¡Pago completado!</h1>
          <p className="text-ink-500 mb-8">
            {plan === 'pro'
              ? 'Ya tienes acceso a contratos ilimitados con Contractly Pro.'
              : 'Tu pago fue procesado. Ahora puedes generar tu contrato.'}
          </p>
          <Link href="/app" className="btn-primary inline-flex">
            Generar mi contrato <ArrowRight size={16} />
          </Link>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { plan: (query.plan as string) || 'single' }
})
