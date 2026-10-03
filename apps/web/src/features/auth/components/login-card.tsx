import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'

export const LoginCard = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <div className="relative w-full border-2 border-[#27272a] bg-[#18181b] p-6 text-[#f4f4f5] shadow-[8px_8px_0px_0px_#1a1a1a] sm:p-8">
    <div className="absolute -top-2.5 -right-2.5 border-2 border-primary bg-primary-fixed px-2 py-0.5 font-bold font-headline text-[10px] text-primary shadow-[2px_2px_0px_0px_#1a1a1a]">
      FIA-RC/AUTH
    </div>
    <div className="mb-6 border-[#27272a] border-b-2 pb-5">
      <div className="mb-3 inline-flex items-center gap-2 border border-[#3f3f46] bg-[#27272a] px-3 py-1">
        <span className="h-2 w-2 bg-secondary" />
        <span className="flex items-center gap-1.5 font-bold font-headline text-[#fafafa] text-[11px] uppercase tracking-wider">
          <Lock className="size-3.5" strokeWidth={2.5} aria-hidden />
          Sistema de acceso restringido
        </span>
      </div>
      <h1 className="font-bold font-headline text-3xl text-white uppercase tracking-tight sm:text-4xl">
        Iniciar sesión
      </h1>
      <p className="mt-1.5 font-body text-[#a1a1aa] text-xs sm:text-sm">
        Ingresá tus credenciales para acceder al sistema.
      </p>
    </div>
    {children}
    <div className="mt-6 border-[#27272a] border-t pt-4 text-center">
      <p className="font-body text-[#71717a] text-[11px] leading-relaxed">
        Fédération Internationale de l'Automobile — Acceso exclusivo para personal administrativo de
        la FIA y personal acreditado de las escuderías.
      </p>
    </div>
  </div>
)
