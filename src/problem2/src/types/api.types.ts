export interface PriceEntry {
  currency: string
  date: string
  price: number
}

export type PricesResponse = PriceEntry[]
