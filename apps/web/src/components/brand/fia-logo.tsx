import type { ReactNode } from 'react'

export const FiaLogo = ({ className }: { readonly className?: string }): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 160 48"
    fill="none"
    role="img"
    aria-label="FIA Gestión Motorsport"
    className={className}
  >
    <rect width="160" height="48" rx="4" fill="#111111" />
    <rect
      x="2"
      y="2"
      width="156"
      height="44"
      rx="2"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeDasharray="2 2"
      strokeOpacity="0.2"
    />
    <path d="M12 12H34V18H20V22H32V28H20V36H12V12Z" fill="#FACC15" />
    <path d="M38 12H46V36H38V12Z" fill="#FFFFFF" />
    <path d="M50 12H68V36H60V27H58V36H50V12ZM58 17V22H60V17H58Z" fill="#FFFFFF" />
    <line x1="74" y1="12" x2="74" y2="36" stroke="#444444" strokeWidth="1.5" />
    <text
      x="82"
      y="22"
      fill="#E2E8F0"
      fontFamily="'Space Grotesk', sans-serif"
      fontWeight="700"
      fontSize="11"
      letterSpacing="1"
    >
      GESTIÓN
    </text>
    <text
      x="82"
      y="34"
      fill="#94A3B8"
      fontFamily="'Space Grotesk', sans-serif"
      fontWeight="500"
      fontSize="9"
      letterSpacing="0.5"
    >
      MOTORSPORT
    </text>
  </svg>
)
