import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, type ReactNode, useState } from 'react'

type Props = ComponentProps<'input'> & {
  readonly id: string
  readonly label: string
  readonly hint: string
  readonly icon: ReactNode
}

const INPUT =
  'w-full rounded-none border-2 border-[#27272a] bg-[#121214] py-2.5 pl-10 font-body text-[#fafafa] text-sm transition-colors placeholder:text-[#52525b] focus:border-primary-fixed focus:outline-none disabled:opacity-60'

export const LoginField = ({ id, label, hint, icon, className, ...props }: Props): ReactNode => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between">
      <label
        htmlFor={id}
        className="font-bold font-headline text-[#d4d4d8] text-xs uppercase tracking-wider"
      >
        {label}
      </label>
      <span className="font-body text-[#71717a] text-[11px] uppercase">{hint}</span>
    </div>
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-3.5 flex items-center text-[#71717a]">
        {icon}
      </span>
      <input id={id} className={`${INPUT} ${className ?? 'pr-3'}`} {...props} />
    </div>
  </div>
)

type PasswordProps = Omit<Props, 'type' | 'className'>

export const PasswordField = (props: PasswordProps): ReactNode => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <LoginField
        {...props}
        type={visible ? 'text' : 'password'}
        className="pr-10 tracking-widest"
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        className="absolute right-2 bottom-1.5 p-1.5 text-[#a1a1aa] transition-colors hover:text-[#fafafa]"
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  )
}
