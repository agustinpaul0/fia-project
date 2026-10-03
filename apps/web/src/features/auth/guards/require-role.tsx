import type { Role } from '@fia/shared/domain'
import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { PageFrame } from '@/components/common/page-query-view'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/auth-client'

type Props = {
  readonly allowedRole: Role
  readonly children: ReactNode
}

const AccessNotice = ({
  title,
  hint,
}: {
  readonly title: string
  readonly hint: string
}): ReactNode => (
  <PageFrame>
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 border-2 border-outline bg-surface-container-lowest px-6 py-10 text-center shadow-brutal-lg">
      <Lock className="size-6 text-secondary" aria-hidden />
      <p className="font-bold font-headline text-lg text-on-surface uppercase tracking-tight">
        {title}
      </p>
      <p className="text-on-surface-variant text-sm">{hint}</p>
    </div>
  </PageFrame>
)

export const RequireRole = ({ allowedRole, children }: Props): ReactNode => {
  const { data: session, isPending } = useSession()
  if (isPending) {
    return (
      <PageFrame>
        <Skeleton className="h-40 w-full" />
      </PageFrame>
    )
  }
  if (!session) {
    return (
      <AccessNotice
        title="Tenés que iniciar sesión para realizar esta acción."
        hint="Usá el botón Iniciar sesión del encabezado con tu cuenta oficial."
      />
    )
  }
  if (session.user.role !== allowedRole) {
    return (
      <AccessNotice
        title="No tenés permisos para realizar esta acción."
        hint="Esta sección es exclusiva de otro perfil de usuario."
      />
    )
  }
  return <>{children}</>
}
