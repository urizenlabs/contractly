import Link from 'next/link'
import { FileText } from 'lucide-react'

interface Props {
  minimal?: boolean
}

export default function Navbar({ minimal }: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-ink-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900 text-[15px]">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <FileText size={14} color="white" />
          </div>
          Contractly
        </Link>
        {!minimal && (
          <div className="flex items-center gap-2">
            <Link href="/#pricing" className="text-sm text-ink-600 hover:text-ink-900 px-3 py-1.5 transition-colors">
              Precios
            </Link>
            <Link href="/app" className="btn-primary text-xs px-4 py-2">
              Crear contrato →
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
