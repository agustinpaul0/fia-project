export const revisionLabel = (revision: number): string =>
  revision === 1 ? 'Puntaje publicado' : `Puntaje corregido (revisión ${revision})`
