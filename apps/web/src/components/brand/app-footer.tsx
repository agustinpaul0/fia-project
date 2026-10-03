import type { ReactNode } from 'react'

export const AppFooter = (): ReactNode => (
  <footer className="w-full border-outline border-t-2 bg-primary py-6 text-on-primary">
    <div className="flex w-full flex-col items-center justify-between gap-4 px-6 md:flex-row lg:px-8">
      <div className="font-label text-surface-variant text-xs uppercase tracking-widest">
        © 2026 FIA — Sistema de gestión. Form follows function.
      </div>
      <div className="font-label text-surface-variant text-xs uppercase tracking-wider">
        Fédération Internationale de l'Automobile
      </div>
    </div>
  </footer>
)
