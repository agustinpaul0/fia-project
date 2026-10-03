export const NAV_LINK_CLASS =
  'whitespace-nowrap px-3 py-1.5 font-label text-xs uppercase tracking-widest transition-[background-color,color] duration-300 ease-out'

export const NAV_INACTIVE = {
  className: 'text-surface-variant hover:bg-surface-tint hover:text-on-primary',
} as const

export const NAV_ACTIVE = {
  className: 'nav-pill bg-primary-container font-bold text-on-primary-container',
} as const
