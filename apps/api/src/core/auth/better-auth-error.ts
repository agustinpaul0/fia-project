import { AppError } from '@fia/shared/domain'
import { toErrorBody } from '../errors/error-body'

export const translateAuthResponse = async (response: Response): Promise<Response> => {
  if (response.status !== 403 && response.status !== 400 && response.status !== 401) {
    return response
  }
  const cloned = response.clone()
  try {
    const data = (await cloned.json()) as { code?: string }
    if (data.code === 'BANNED_USER') {
      const error = new AppError('INVALID_CREDENTIALS')
      return new Response(JSON.stringify(toErrorBody(error)), {
        status: error.status,
        headers: { 'content-type': 'application/json' },
      })
    }
    return response
  } catch {
    return response
  }
}
