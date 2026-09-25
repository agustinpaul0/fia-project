import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/auth-client'

export const RequireFiaAdmin = ({ children }: { readonly children: ReactNode }): ReactNode => {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <Skeleton className="h-40 w-full" />
  }

  if (!session) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Tenés que iniciar sesión para realizar esta acción.</p>
      </div>
    )
  }

  if (session.user.role !== 'fia_admin') {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive font-medium">No tenés permisos para realizar esta acción.</p>
      </div>
    )
  }

  return <>{children}</>
}
