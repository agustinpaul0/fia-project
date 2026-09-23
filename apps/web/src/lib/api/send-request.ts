import { AppError } from '@fia/shared/domain'
import { API_URL } from './api-url'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestSpec = {
  readonly path: string
  readonly method?: HttpMethod
  readonly body?: unknown
}

export const sendRequest = async ({
  path,
  method = 'GET',
  body,
}: RequestSpec): Promise<Response> => {
  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
  } catch {
    throw new AppError('NETWORK_ERROR')
  }
}

export const readJson = async (response: Response): Promise<unknown> => {
  const text = await response.text()
  try {
    return text.length === 0 ? null : JSON.parse(text)
  } catch {
    return null
  }
}
