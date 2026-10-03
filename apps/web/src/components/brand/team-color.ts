export type TeamColor = {
  readonly solid: string
  readonly chip: string
}

const NEUTRAL: TeamColor = {
  solid: 'bg-primary',
  chip: 'border-outline bg-surface-container text-on-surface',
}

const TEAM_COLORS: readonly (readonly [string, TeamColor])[] = [
  ['ferrari', { solid: 'bg-[#e8002d]', chip: 'border-[#e8002d] bg-[#fff1f2] text-[#c00024]' }],
  ['red bull', { solid: 'bg-[#1e3a8a]', chip: 'border-[#1e3a8a] bg-[#eff6ff] text-[#1e3a8a]' }],
  ['mercedes', { solid: 'bg-[#00a19c]', chip: 'border-[#00a19c] bg-[#f0fdfa] text-[#0f766e]' }],
  ['mclaren', { solid: 'bg-[#ff8000]', chip: 'border-[#ff8000] bg-[#fff7ed] text-[#c2410c]' }],
  ['williams', { solid: 'bg-[#0055ff]', chip: 'border-[#0055ff] bg-[#eff6ff] text-[#0047d4]' }],
  ['aston martin', { solid: 'bg-[#006f62]', chip: 'border-[#006f62] bg-[#ecfdf5] text-[#006f62]' }],
  ['alpine', { solid: 'bg-[#ff87bc]', chip: 'border-[#e0569a] bg-[#fdf2f8] text-[#be185d]' }],
  ['haas', { solid: 'bg-[#6b7280]', chip: 'border-[#6b7280] bg-[#f9fafb] text-[#374151]' }],
  ['sauber', { solid: 'bg-[#52e252]', chip: 'border-[#16a34a] bg-[#f0fdf4] text-[#15803d]' }],
  ['racing bulls', { solid: 'bg-[#6692ff]', chip: 'border-[#4f46e5] bg-[#eef2ff] text-[#4338ca]' }],
]

export const teamColor = (teamName: string): TeamColor => {
  const name = teamName.toLowerCase()
  return TEAM_COLORS.find(([key]) => name.includes(key))?.[1] ?? NEUTRAL
}
