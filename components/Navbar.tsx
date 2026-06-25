import Link from 'next/link'
import { useState } from 'react'
import { FileText, Menu, X } from 'lucide-react'

interface Props {
  minimal?: boolean
}

export default function Navbar({ minimal }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900 text-[15px]">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <FileText size={13} color="white" />
          </div>
          Contractly
        </Link>

        {/* Desktop nav */}
        {!minimal && (
          <>
            <div className="hidden sm:flex items-center gap-1">
              <Link href="#como-funciona" className="text-sm text-ink-500 hover:text-ink-900 px-3 py-1.5 rounded-lg hover:bg-ink-50 transition-all">
                Cómo funciona
              </Link>
              <Link href="#pricing" className="text-sm text-ink-500 hover:text-ink-900 px-3 py-1.5 rounded-lg hover:bg-ink-50 transition-all">
                Precios
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/app" className="btn-primary text-xs px-4 py-2 rounded-lg">
                Crear contrato →
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 text-ink-500 hover:text-ink-900 transition-colors"
              onClick={() => setOpen(o => !o)}
              aria-label="Menú"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile drawer */}
      {!minimal && open && (
        <div className="sm:hidden border-t border-ink-100 bg-white px-4 py-4 flex flex-col gap-2">
          <Link href="#como-funciona" onClick={() => setOpen(false)} className="text-sm text-ink-700 py-2.5 border-b border-ink-50">
            Cómo funciona
          </Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="text-sm text-ink-700 py-2.5 border-b border-ink-50">
            Precios
          </Link>
          <Link href="/app" onClick={() => setOpen(false)} className="btn-primary justify-center mt-2 py-3 text-sm">
            Crear contrato →
          </Link>
        </div>
      )}
    </nav>
  )
}
