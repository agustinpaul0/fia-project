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
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <RadixDialog.Content
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-5 overflow-y-auto border-2 border-outline bg-surface p-6 shadow-brutal-lg',
        className,
      )}
      {...props}
    >
      {children}
      <RadixDialog.Close
        aria-label="Cerrar"
        className="absolute top-5 right-5 border border-outline px-2 font-bold font-mono text-lg hover:bg-primary hover:text-on-primary"
      >
        ✕
      </RadixDialog.Close>
    </RadixDialog.Content>
  </RadixDialog.Portal>
)

export const DialogHeader = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div
    className={cn('flex flex-col gap-2 border-outline border-b-2 pb-3 text-left', className)}
    {...props}
  />
)

export const DialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof RadixDialog.Title>): ReactNode => (
  <RadixDialog.Title
    className={cn(
      "flex items-center gap-2 font-bold font-headline text-xl uppercase leading-none tracking-tight before:size-3 before:shrink-0 before:border-2 before:border-outline before:bg-primary-container before:content-['']",
      className,
    )}
    {...props}
  />
)

export const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof RadixDialog.Description>): ReactNode => (
  <RadixDialog.Description
    className={cn('font-mono text-on-surface-variant text-xs', className)}
    {...props}
  />
)

export const DialogFooter = ({ className, ...props }: ComponentProps<'div'>): ReactNode => (
  <div
    className={cn(
      'flex flex-col-reverse gap-3 border-outline border-t-2 pt-4 sm:flex-row sm:justify-end',
      className,
    )}
    {...props}
  />
)
