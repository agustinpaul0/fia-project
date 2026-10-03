import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'
import type * as React from 'react'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border-2 border-outline font-bold font-headline uppercase tracking-wider whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-x-px active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-on-primary hover:bg-primary-container hover:text-primary',
        accent:
          'bg-primary-container text-primary shadow-brutal hover:bg-primary hover:text-on-primary',
        outline:
          'bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary',
        secondary:
          'bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary',
        ghost: 'border-transparent hover:border-outline hover:bg-surface-container',
        destructive:
          'border-secondary bg-surface-container-lowest text-secondary hover:bg-secondary hover:text-on-primary',
        danger:
          'border-outline bg-secondary text-on-primary shadow-brutal-sm hover:bg-primary hover:text-on-primary',
        link: 'border-transparent text-tertiary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 text-xs',
        xs: 'h-6 gap-1 px-2 text-[10px]',
        sm: 'h-8 gap-1.5 px-3 text-[11px]',
        lg: 'h-12 px-6 text-sm',
        icon: 'size-10',
        'icon-xs': 'size-6',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
