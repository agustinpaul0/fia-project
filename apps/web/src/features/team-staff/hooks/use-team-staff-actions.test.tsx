import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { createTestQueryClient } from '@/testing/render-with-query'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { useTeamStaffActions } from './use-team-staff-actions'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const wrapper = ({ children }: { readonly children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
)

const member = aTeamStaffMember()

describe('useTeamStaffActions', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.mocked(toast.success).mockClear()
  })

  it('avisa el alta', async () => {
    mockFetchOnce(jsonResponse(member, 201))
    const { result } = renderHook(() => useTeamStaffActions(), { wrapper })
    await result.current.onCreate({
      firstName: 'Carlos',
      lastName: 'Sainz',
      email: 'carlos@williams.com',
      password: 'Password123!',
      teamId: member.teamId,
      roleInTeam: 'Piloto',
      phoneNumber: '+44 1235 777700',
      fileNumber: 'WIL-55',
    })
    expect(toast.success).toHaveBeenCalledWith('Cuenta creada exitosamente')
  })

  it('avisa la edición', async () => {
    mockFetchOnce(jsonResponse(member))
    const { result } = renderHook(() => useTeamStaffActions(), { wrapper })
    const body = {
      firstName: 'A',
      lastName: 'B',
      teamId: member.teamId,
      roleInTeam: 'Jefe',
      phoneNumber: '1234567',
      version: 1,
    }
    await result.current.onUpdate(member.id, body)
    expect(toast.success).toHaveBeenCalledWith('Datos actualizados exitosamente')
  })

  it('avisa la baja', async () => {
    mockFetchOnce(new Response(null, { status: 204 }))
    const { result } = renderHook(() => useTeamStaffActions(), { wrapper })
    await result.current.onDeactivate(member.id, 1)
    expect(toast.success).toHaveBeenCalledWith('Cuenta dada de baja exitosamente')
  })
})
