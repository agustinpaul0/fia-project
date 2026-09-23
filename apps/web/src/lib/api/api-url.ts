import { z } from 'zod'

export const API_URL: string = z
  .url()
  .parse(import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000')
