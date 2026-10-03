import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'
import type * as React from 'react'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-outline px-2 py-0.5 font-bold font-label text-[10px] uppercase tracking-wider whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-container',
        secondary: 'bg-surface-container-high text-on-surface',
        destructive: 'border-secondary bg-secondary text-on-primary',
        outline: 'bg-surface-container-lowest text-on-surface',
        accent: 'bg-primary-container text-primary',
        info: 'border-tertiary bg-tertiary text-on-tertiary',
        ghost: 'border-transparent text-on-surface-variant',
        link: 'border-transparent text-tertiary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
