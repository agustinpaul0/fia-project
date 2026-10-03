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
    <RadixAlertDialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <RadixAlertDialog.Content
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-5 overflow-y-auto border-2 border-outline bg-surface p-6 shadow-brutal-lg',
        className,
      )}
      {...props}
    >
      {children}
    </RadixAlertDialog.Content>
  </RadixAlertDialog.Portal>
)

export const AlertDialogHeader = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div
    className={cn('flex flex-col gap-2 border-outline border-b-2 pb-3 text-left', className)}
    {...props}
  />
)

export const AlertDialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof RadixAlertDialog.Title>): ReactNode => (
  <RadixAlertDialog.Title
    className={cn(
      "flex items-center gap-2 font-bold font-headline text-xl uppercase leading-none tracking-tight before:size-3 before:shrink-0 before:border-2 before:border-outline before:bg-primary-container before:content-['']",
      className,
    )}
    {...props}
  />
)

export const AlertDialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof RadixAlertDialog.Description>): ReactNode => (
  <RadixAlertDialog.Description
    className={cn('font-mono text-on-surface-variant text-xs', className)}
    {...props}
  />
)

export const AlertDialogFooter = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div
    className={cn(
      'flex flex-col-reverse gap-3 border-outline border-t-2 pt-4 sm:flex-row sm:justify-end',
      className,
    )}
    {...props}
  />
)
