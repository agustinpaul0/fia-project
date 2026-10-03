export type CategoryAccent = {
  readonly badge: string
  readonly dot: string
  readonly text: string
  readonly hover: string
  readonly cta: string
}

const FIRST: CategoryAccent = {
  badge: 'bg-primary-container text-primary',
  dot: 'bg-primary',
  text: 'text-secondary',
  hover: 'hover:shadow-[10px_10px_0px_#ffcc00]',
  cta: 'bg-primary text-on-primary group-hover:bg-primary-container group-hover:text-primary',
}

const ACCENTS: readonly CategoryAccent[] = [
  FIRST,
  {
    badge: 'bg-surface-container-lowest text-primary',
    dot: 'bg-tertiary',
    text: 'text-tertiary',
    hover: 'hover:shadow-[10px_10px_0px_#0055ff]',
    cta: 'bg-surface text-on-surface group-hover:bg-tertiary group-hover:text-on-tertiary',
  },
  {
    badge: 'bg-primary text-on-primary',
    dot: 'bg-outline',
    text: 'text-on-surface-variant',
    hover: 'hover:shadow-[10px_10px_0px_#15803d]',
    cta: 'bg-surface text-on-surface group-hover:bg-fia-green group-hover:text-on-primary',
  },
  {
    badge: 'bg-secondary text-on-primary',
    dot: 'bg-secondary',
    text: 'text-secondary',
    hover: 'hover:shadow-[10px_10px_0px_#e63b2e]',
    cta: 'bg-surface text-on-surface group-hover:bg-secondary group-hover:text-on-primary',
  },
]

export const accentFor = (index: number): CategoryAccent => ACCENTS[index % ACCENTS.length] ?? FIRST
