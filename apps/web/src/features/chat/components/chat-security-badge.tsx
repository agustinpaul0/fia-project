import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'

export const ChatSecurityBadge = (): ReactNode => (
  <div className="inline-flex items-center gap-1.5 border-2 border-black bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-950 shadow-brutal-sm">
    <Lock className="size-3.5 text-emerald-800" />
    <span className="uppercase tracking-wider">Cifrado E2E Activo</span>
    <span className="hidden sm:inline font-normal text-emerald-800">
      (ECDH P-256 · AES-GCM 256 · Firma ECDSA)
    </span>
  </div>
)
