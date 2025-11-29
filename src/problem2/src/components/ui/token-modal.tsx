import { useState, useMemo, useEffect, useRef } from 'react'
import type { Token } from '../../types'
import { useDebounce } from '../../hooks'
import { TokenIcon } from './token-icon'
import { formatExchangeRate } from '../../utils'

interface TokenModalProps {
  isOpen: boolean
  tokens: Token[]
  onClose: () => void
  onSelect: (token: Token) => void
  selectedToken?: Token | null
  disabledToken?: Token | null
}

export function TokenModal({
  isOpen,
  tokens,
  onClose,
  onSelect,
  selectedToken,
  disabledToken,
}: TokenModalProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 200)
  const modalRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredTokens = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim()
    if (!query) return tokens
    return tokens.filter(token =>
      token.symbol.toLowerCase().includes(query)
    )
  }, [tokens, debouncedSearch])

  // Keyboard: Esc to close
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setSearch('')
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] bg-surface backdrop-blur-glass
                   border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-glass
                   flex flex-col animate-slideUp sm:animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Select a token"
      >
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-semibold">Select a token</h2>
          <button
            className="text-2xl text-gray-400 hover:text-gray-200 w-8 h-8 flex items-center justify-center
                       rounded-lg hover:bg-white/5 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                       text-gray-200 outline-none focus:border-primary/50 transition-colors
                       placeholder:text-gray-500"
            aria-label="Search tokens"
          />
        </div>

        <div className="overflow-y-auto flex-1 px-2 pb-4 sm:pb-5">
          {filteredTokens.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No tokens found</div>
          ) : (
            filteredTokens.map(token => {
              const isSelected = selectedToken?.symbol === token.symbol
              const isDisabled = disabledToken?.symbol === token.symbol

              return (
                <button
                  key={token.symbol}
                  className={`
                    flex items-center gap-3 w-full p-3 rounded-xl text-left
                    transition-colors duration-150
                    ${isSelected ? 'bg-primary/20' : 'hover:bg-white/5'}
                    ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  onClick={() => {
                    if (!isDisabled) {
                      onSelect(token)
                      onClose()
                    }
                  }}
                  disabled={isDisabled}
                >
                  <TokenIcon symbol={token.symbol} iconUrl={token.iconUrl} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-200">{token.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">
                      ${formatExchangeRate(token.price)}
                    </div>
                  </div>
                  {isSelected && (
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}
