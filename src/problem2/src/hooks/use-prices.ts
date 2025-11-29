import { useQuery } from '@tanstack/react-query'
import type { PricesResponse, Token } from '../types'
import { deduplicateTokens, sortTokensBySymbol } from '../utils'

const API_URL = 'https://interview.switcheo.com/prices.json'

async function fetchPrices(): Promise<Token[]> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch prices')
  }
  const data: PricesResponse = await response.json()
  const uniqueTokens = deduplicateTokens(data)
  return sortTokensBySymbol(uniqueTokens)
}

export function usePrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
