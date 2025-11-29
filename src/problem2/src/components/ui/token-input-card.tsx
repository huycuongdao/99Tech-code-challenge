import type { Token } from '../../types'
import { TokenIcon } from './token-icon'
import { formatExchangeRate } from '../../utils'

interface TokenInputCardProps {
  label: string
  token: Token | null
  amount: string
  onAmountChange: (value: string) => void
  onTokenSelect: () => void
  readOnly?: boolean
}

export function TokenInputCard({
  label,
  token,
  amount,
  onAmountChange,
  onTokenSelect,
  readOnly = false,
}: TokenInputCardProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only valid number input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value)
    }
  }

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        {token && (
          <span className="text-xs text-gray-500">
            ${formatExchangeRate(token.price)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={handleInputChange}
          readOnly={readOnly}
          className={`
            flex-1 bg-transparent border-none outline-none text-2xl sm:text-3xl font-semibold
            text-gray-100 placeholder:text-gray-600 min-w-0
            ${readOnly ? 'cursor-default' : ''}
          `}
          aria-label={`${label} amount`}
        />

        <button
          type="button"
          onClick={onTokenSelect}
          className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10
                     rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10
                     min-h-[48px] flex-shrink-0"
          aria-label={`Select ${label.toLowerCase()} token`}
        >
          {token ? (
            <>
              <TokenIcon symbol={token.symbol} iconUrl={token.iconUrl} size={24} />
              <span className="text-base font-semibold text-gray-200">{token.symbol}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm whitespace-nowrap">Select token</span>
          )}
          <svg className="text-gray-400 flex-shrink-0" width="16" height="16" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
