import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'error'
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'min-h-[52px] font-semibold flex items-center justify-center gap-2 transition-all duration-200'

  const variantClasses = {
    primary: 'btn-primary',
    success: 'btn-success',
    error: 'btn-error',
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'opacity-80 cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={20} />}
      <span>{children}</span>
    </button>
  )
}
