import type { PriceEntry, Token } from '../types'

const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens'

export function buildIconUrl(symbol: string): string {
  return `${ICON_BASE_URL}/${symbol}.svg`
}

export function deduplicateTokens(entries: PriceEntry[]): Token[] {
  const latestEntries = new Map<string, PriceEntry>()

  entries.forEach(entry => {
    const existing = latestEntries.get(entry.currency)
    if (!existing || new Date(entry.date) > new Date(existing.date)) {
      latestEntries.set(entry.currency, entry)
    }
  })

  return Array.from(latestEntries.values()).map(entry => ({
    symbol: entry.currency,
    price: entry.price,
    iconUrl: buildIconUrl(entry.currency),
  }))
}

export function sortTokensBySymbol(tokens: Token[]): Token[] {
  return [...tokens].sort((a, b) => a.symbol.localeCompare(b.symbol))
}
