import {
  categoryListSchema,
  categorySchema,
  createCategoryBodySchema,
  idParamsSchema,
  updateCategoryBodySchema,
  versionQuerySchema,
} from '@fia/shared/contracts'
import { Hono } from 'hono'
import { publicAccess, requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, noContent, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { CategoriesService } from './categories.service'

const onlyFiaAdmin = requireRole('fia_admin')

export const createCategoriesRoutes = (service: CategoriesService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', publicAccess, async (c) => ok(c, categoryListSchema, await service.list()))
    .get('/:id', publicAccess, validate('param', idParamsSchema), async (c) =>
      ok(c, categorySchema, await service.get(c.req.valid('param').id)),
    )
    .post('/', onlyFiaAdmin, validate('json', createCategoryBodySchema), async (c) =>
      created(c, categorySchema, await service.create(c.req.valid('json'))),
    )
    .put(
      '/:id',
      onlyFiaAdmin,
      validate('param', idParamsSchema),
      validate('json', updateCategoryBodySchema),
      async (c) =>
        ok(c, categorySchema, await service.update(c.req.valid('param').id, c.req.valid('json'))),
    )
    .delete(
      '/:id',
      onlyFiaAdmin,
      validate('param', idParamsSchema),
      validate('query', versionQuerySchema),
      async (c) => {
        await service.remove(c.req.valid('param').id, c.req.valid('query').version)
        return noContent(c)
      },
    )
