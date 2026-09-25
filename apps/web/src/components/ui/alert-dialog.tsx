import { AlertDialog as RadixAlertDialog } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const AlertDialog = RadixAlertDialog.Root
export const AlertDialogTrigger = RadixAlertDialog.Trigger
export const AlertDialogAction = RadixAlertDialog.Action
export const AlertDialogCancel = RadixAlertDialog.Cancel

export const AlertDialogContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof RadixAlertDialog.Content>): ReactNode => (
  <RadixAlertDialog.Portal>
    <RadixAlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <RadixAlertDialog.Content
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
    </RadixAlertDialog.Content>
  </RadixAlertDialog.Portal>
)

export const AlertDialogHeader = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
)

export const AlertDialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof RadixAlertDialog.Title>): ReactNode => (
  <RadixAlertDialog.Title className={cn('text-lg font-semibold', className)} {...props} />
)

export const AlertDialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof RadixAlertDialog.Description>): ReactNode => (
  <RadixAlertDialog.Description
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

export const AlertDialogFooter = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
    {...props}
  />
)
