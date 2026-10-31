import {
  API_PATHS,
  type CreateDriverAccountBody,
  type DriverAccount,
  driverAccountListSchema,
  driverAccountPath,
  driverAccountSchema,
  type UpdateDriverAccountBody,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const DRIVER_ACCOUNTS_QUERY_KEY = ['driver-accounts'] as const

export type AccountVersion = { readonly id: string; readonly version: number }

export const fetchDriverAccounts = (): Promise<readonly DriverAccount[]> =>
  apiRequest({ path: API_PATHS.driverAccounts, schema: driverAccountListSchema })

export const createDriverAccount = (body: CreateDriverAccountBody): Promise<DriverAccount> =>
  apiRequest({ path: API_PATHS.driverAccounts, method: 'POST', body, schema: driverAccountSchema })

export const updateDriverAccount = ({
  id,
  body,
}: {
  readonly id: string
  readonly body: UpdateDriverAccountBody
}): Promise<DriverAccount> =>
  apiRequest({ path: driverAccountPath(id), method: 'PUT', body, schema: driverAccountSchema })

export const deactivateDriverAccount = ({ id, version }: AccountVersion): Promise<DriverAccount> =>
  apiRequest({
    path: `${driverAccountPath(id)}?version=${version}`,
    method: 'DELETE',
    schema: driverAccountSchema,
  })
