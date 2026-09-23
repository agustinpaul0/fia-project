import { z } from 'zod'
import { versionSchema } from './common'

export const CATEGORY_NAME_MAX_LENGTH = 60
export const CATEGORY_CODE_PATTERN = /^[A-Z0-9]{2,10}$/

const categoryNameSchema = z
  .string()
  .trim()
  .min(2, 'El nombre debe tener al menos 2 caracteres.')
  .max(CATEGORY_NAME_MAX_LENGTH, 'El nombre no puede superar los 60 caracteres.')

const categoryCodeSchema = z
  .string()
  .trim()
  .regex(CATEGORY_CODE_PATTERN, 'El código debe tener entre 2 y 10 letras mayúsculas o números.')

export const createCategoryBodySchema = z.strictObject({
  name: categoryNameSchema,
  code: categoryCodeSchema,
})

export const updateCategoryBodySchema = createCategoryBodySchema.extend({ version: versionSchema })

export const categorySchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const categoryListSchema = z.array(categorySchema).readonly()

export type Category = z.infer<typeof categorySchema>
export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>
export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>
