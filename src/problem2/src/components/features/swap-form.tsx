import { useState, useEffect, useCallback } from 'react'
import { usePrices, useSwapCalculation } from '../../hooks'
import { TokenInputCard, TokenModal, Button } from '../ui'
import { formatExchangeRate } from '../../utils'
import type { Token } from '../../types'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export function SwapForm() {
  const { data: tokens = [], isLoading: isLoadingTokens, error: tokensError } = usePrices()

  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'from' | 'to'>('from')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const calculation = useSwapCalculation({ fromToken, toToken, fromAmount })

  // Auto-update toAmount when calculation changes
  useEffect(() => {
    if (calculation) {
      setToAmount(calculation.toAmount.toFixed(6))
    } else {
      setToAmount('')
    }
  }, [calculation])

  const handleSwapDirection = useCallback(() => {
    const prevFromToken = fromToken
    const prevToToken = toToken
    const prevToAmount = toAmount

    setFromToken(prevToToken)
    setToToken(prevFromToken)
    setFromAmount(prevToAmount)
  }, [fromToken, toToken, toAmount])

  const handleTokenSelect = useCallback((token: Token) => {
    if (modalMode === 'from') {
      // If selecting same as toToken, swap them
      if (toToken?.symbol === token.symbol) {
        setToToken(fromToken)
      }
      setFromToken(token)
    } else {
      // If selecting same as fromToken, swap them
      if (fromToken?.symbol === token.symbol) {
        setFromToken(toToken)
      }
      setToToken(token)
    }
  }, [modalMode, fromToken, toToken])

  const openModal = useCallback((mode: 'from' | 'to') => {
    setModalMode(mode)
    setIsModalOpen(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (!fromToken || !toToken || !fromAmount) return
    const num = parseFloat(fromAmount)
    if (isNaN(num) || num <= 0) return

    // Simulate swap with 2s delay
    setSubmitState('loading')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitState('success')

      // Auto-reset after 3s
      setTimeout(() => {
        setSubmitState('idle')
        setFromAmount('')
        setToAmount('')
      }, 3000)
    } catch {
      setSubmitState('error')
      setTimeout(() => setSubmitState('idle'), 3000)
    }
  }

  // Smart button text
  const getButtonText = (): string => {
    if (submitState === 'loading') return 'Swapping...'
    if (submitState === 'success') return 'Swap Successful!'
    if (submitState === 'error') return 'Failed - Try Again'

    if (!fromToken || !toToken) return 'Select a token'
    if (!fromAmount || fromAmount === '') return 'Enter an amount'

    const num = parseFloat(fromAmount)
    if (isNaN(num) || num <= 0) return 'Enter a valid amount'

    return 'Swap'
  }

  const getButtonVariant = (): 'primary' | 'success' | 'error' => {
    if (submitState === 'success') return 'success'
    if (submitState === 'error') return 'error'
    return 'primary'
  }

  const isButtonDisabled = (): boolean => {
    if (submitState === 'loading' || submitState === 'success') return true
    if (!fromToken || !toToken || !fromAmount) return true
    const num = parseFloat(fromAmount)
    return isNaN(num) || num <= 0
  }

  // Loading state
  if (isLoadingTokens) {
    return (
      <div className="glass-card p-8 w-full max-w-md text-center">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-8 bg-white/10 rounded w-1/3 mx-auto" />
          <div className="h-24 bg-white/10 rounded" />
          <div className="h-12 w-12 bg-white/10 rounded-full mx-auto" />
          <div className="h-24 bg-white/10 rounded" />
          <div className="h-14 bg-white/10 rounded" />
        </div>
        <p className="text-gray-400 mt-4">Loading tokens...</p>
      </div>
    )
  }

  // Error state
  if (tokensError) {
    return (
      <div className="glass-card p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Failed to load tokens</h2>
        <p className="text-gray-400 mb-6">{tokensError.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary px-6 py-3"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <form className="glass-card p-5 sm:p-6 w-full max-w-md" onSubmit={handleSubmit}>
      <h1 className="text-xl sm:text-2xl font-bold mb-5 text-center text-gray-100">Swap</h1>

      <div className="space-y-1">
        <TokenInputCard
          label="From"
          token={fromToken}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onTokenSelect={() => openModal('from')}
        />

        <div className="flex justify-center -my-3 relative z-10">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 bg-surface-hover
                       border-4 border-indigo-500/50 rounded-full cursor-pointer
                       transition-all duration-300 hover:rotate-180 hover:border-indigo-400
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:rotate-0"
            onClick={handleSwapDirection}
            disabled={!fromToken && !toToken}
            aria-label="Swap direction"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-200">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                    stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <TokenInputCard
          label="To"
          token={toToken}
          amount={toAmount}
          onAmountChange={setToAmount}
          onTokenSelect={() => openModal('to')}
          readOnly
        />
      </div>

      {calculation && fromToken && toToken && (
        <div className="mt-4 p-3 bg-white/5 rounded-xl text-center text-sm text-gray-400">
          <span>1 {fromToken.symbol} = {formatExchangeRate(calculation.exchangeRate)} {toToken.symbol}</span>
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        variant={getButtonVariant()}
        loading={submitState === 'loading'}
        disabled={isButtonDisabled()}
        className="mt-4"
      >
        {getButtonText()}
      </Button>

      {submitState === 'success' && (
        <div
          className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl
                     text-center text-sm text-emerald-400 animate-fadeIn"
          role="alert"
        >
          Successfully swapped {fromAmount} {fromToken?.symbol} for {toAmount} {toToken?.symbol}!
        </div>
      )}

      <TokenModal
        isOpen={isModalOpen}
        tokens={tokens}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleTokenSelect}
        selectedToken={modalMode === 'from' ? fromToken : toToken}
        disabledToken={modalMode === 'from' ? toToken : fromToken}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </form>
  )
}
