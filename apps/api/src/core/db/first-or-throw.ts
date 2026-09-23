export const firstOrThrow = <Row>(rows: readonly Row[]): Row => {
  const [first] = rows
  if (first === undefined) {
    throw new Error('La operación no devolvió ninguna fila')
  }
  return first
}
