import { AppError } from '@fia/shared/domain'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifyError } from './notify-error'

describe('notifyError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra un toast con el mensaje del catálogo', () => {
    const spy = vi.spyOn(toast, 'error').mockReturnValue(1)
    notifyError(new AppError('STALE_VERSION'))
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Otra persona modificó'))
  })
})
