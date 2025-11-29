import { useState } from 'react'
import { TokenFallback } from './token-fallback'

interface TokenIconProps {
  symbol: string
  iconUrl: string
  size?: number
}

export function TokenIcon({ symbol, iconUrl, size = 32 }: TokenIconProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <TokenFallback symbol={symbol} size={size} />
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      className="rounded-full flex-shrink-0"
      style={{ width: size, height: size }}
      onError={() => setHasError(true)}
    />
  )
}
