import { generateColorFromString, getInitials } from '../../utils'

interface TokenFallbackProps {
  symbol: string
  size?: number
}

export function TokenFallback({ symbol, size = 32 }: TokenFallbackProps) {
  const bgColor = generateColorFromString(symbol)
  const initials = getInitials(symbol)

  return (
    <div
      className="inline-flex items-center justify-center rounded-full text-white font-bold flex-shrink-0 select-none"
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
      title={symbol}
    >
      {initials}
    </div>
  )
}
