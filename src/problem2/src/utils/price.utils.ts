export function formatPrice(price: number, decimals = 2): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function parseAmount(value: string): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

export function isValidAmount(value: string): boolean {
  if (!value || value.trim() === '') return false
  const num = parseFloat(value)
  return !isNaN(num) && num > 0
}

export function formatExchangeRate(rate: number): string {
  if (rate < 0.0001) {
    return rate.toExponential(4)
  }
  if (rate > 1000000) {
    return rate.toExponential(4)
  }
  return formatPrice(rate, 6)
}
