import { Dialog as RadixDialog } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

export const DialogContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof RadixDialog.Content>): ReactNode => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <RadixDialog.Content
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
    </RadixDialog.Content>
  </RadixDialog.Portal>
)

export const DialogHeader = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)} {...props} />
)

export const DialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof RadixDialog.Title>): ReactNode => (
  <RadixDialog.Title className={cn('text-lg font-semibold leading-none', className)} {...props} />
)

export const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof RadixDialog.Description>): ReactNode => (
  <RadixDialog.Description className={cn('text-sm text-muted-foreground', className)} {...props} />
)

export const DialogFooter = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
    {...props}
  />
)
