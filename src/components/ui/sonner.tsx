import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast !bg-surface-card !border-border !text-foreground !font-mono shadow-modal',
          description: '!text-secondary',
          actionButton: '!bg-primary !text-ink',
          cancelButton: '!bg-surface-raised !text-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
