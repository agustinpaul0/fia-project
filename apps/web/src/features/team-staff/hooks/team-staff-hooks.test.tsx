import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { useCreateTeamStaff } from './use-create-team-staff'
import { useDeactivateTeamStaff } from './use-deactivate-team-staff'
import { useUpdateTeamStaff } from './use-update-team-staff'

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { readonly children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe('team-staff mutation hooks', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('useCreateTeamStaff ejecuta la mutación exitosamente', async () => {
    const member = aTeamStaffMember()
    mockFetchOnce(jsonResponse(member, 201))
    const { result } = renderHook(() => useCreateTeamStaff(), { wrapper: createWrapper() })
    result.current.mutate({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      password: 'Password123!',
      teamId: member.teamId,
      roleInTeam: member.roleInTeam,
      phoneNumber: member.phoneNumber,
      fileNumber: member.fileNumber,
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useUpdateTeamStaff ejecuta la mutación exitosamente', async () => {
    const member = aTeamStaffMember({ version: 2 })
    mockFetchOnce(jsonResponse(member))
    const { result } = renderHook(() => useUpdateTeamStaff(), { wrapper: createWrapper() })
    result.current.mutate({
      id: member.id,
      body: {
        firstName: 'Carlos',
        lastName: 'Sainz',
        teamId: member.teamId,
        roleInTeam: 'Piloto',
        phoneNumber: '+54 9 291 1234567',
        version: 1,
      },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useDeactivateTeamStaff ejecuta la mutación exitosamente', async () => {
    mockFetchOnce(new Response(null, { status: 204 }))
    const { result } = renderHook(() => useDeactivateTeamStaff(), { wrapper: createWrapper() })
    result.current.mutate({ id: '00000000-0000-4000-8000-000000000001', version: 1 })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
