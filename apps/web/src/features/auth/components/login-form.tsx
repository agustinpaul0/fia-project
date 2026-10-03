import { ArrowRight, KeyRound, Mail } from 'lucide-react'
import type { ReactNode } from 'react'
import { type LoginState, useLogin } from '../hooks/use-login'
import { LoginCard } from './login-card'
import { LoginField, PasswordField } from './login-field'

const LoginFormFields = ({ login }: { readonly login: LoginState }): ReactNode => (
  <form onSubmit={login.submit} className="flex flex-col gap-5">
    {login.error !== null && (
      <p
        role="alert"
        className="border-2 border-secondary bg-secondary/15 px-3 py-2 text-[#fecaca] text-sm"
      >
        {login.error}
      </p>
    )}
    <LoginField
      id="email"
      label="Correo electrónico"
      hint="ID oficial"
      icon={<Mail className="size-4" aria-hidden />}
      type="email"
      required
      value={login.email}
      onChange={(e) => login.setEmail(e.target.value)}
      disabled={login.loading}
      placeholder="admin@fia.com"
    />
    <PasswordField
      id="password"
      label="Contraseña"
      hint="Token secreto"
      icon={<KeyRound className="size-4" aria-hidden />}
      required
      value={login.password}
      onChange={(e) => login.setPassword(e.target.value)}
      disabled={login.loading}
      placeholder="••••••••••••"
    />
    <button
      type="submit"
      disabled={login.loading}
      className="mt-2 flex w-full items-center justify-center gap-2 border-2 border-primary bg-[#facc15] py-3 font-bold font-headline text-primary text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:bg-[#e6b800] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#ffffff] disabled:opacity-60"
    >
      <span>{login.loading ? 'Iniciando sesión...' : '[ Iniciar sesión ]'}</span>
      <ArrowRight className="size-4" aria-hidden />
    </button>
  </form>
)

export const LoginForm = (): ReactNode => (
  <div className="flex w-full flex-1 items-center justify-center px-6 py-12">
    <div className="w-full max-w-lg">
      <LoginCard>
        <LoginFormFields login={useLogin()} />
      </LoginCard>
    </div>
  </div>
)
