export interface Token {
  symbol: string
  price: number
  iconUrl: string
}

export interface SwapCalculation {
  fromAmount: number
  toAmount: number
  exchangeRate: number
  inverseRate: number
}

export interface SwapFormData {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
}
