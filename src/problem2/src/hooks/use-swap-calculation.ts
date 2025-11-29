import { useMemo } from 'react'
import type { Token, SwapCalculation } from '../types'
import { parseAmount } from '../utils'

interface UseSwapCalculationProps {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
}

export function useSwapCalculation({
  fromToken,
  toToken,
  fromAmount,
}: UseSwapCalculationProps): SwapCalculation | null {
  return useMemo(() => {
    if (!fromToken || !toToken || !fromAmount) {
      return null
    }

    const amount = parseAmount(fromAmount)
    if (amount <= 0) {
      return null
    }

    const exchangeRate = fromToken.price / toToken.price
    const toAmountValue = amount * exchangeRate

    return {
      fromAmount: amount,
      toAmount: toAmountValue,
      exchangeRate,
      inverseRate: 1 / exchangeRate,
    }
  }, [fromToken, toToken, fromAmount])
}
