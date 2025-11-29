import { z } from 'zod'

const tokenSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  iconUrl: z.string(),
})

export const swapSchema = z.object({
  fromToken: tokenSchema.nullable().refine(val => val !== null, {
    message: 'Select a token',
  }),
  toToken: tokenSchema.nullable().refine(val => val !== null, {
    message: 'Select a token',
  }),
  fromAmount: z.string()
    .min(1, 'Enter an amount')
    .refine(val => {
      const num = parseFloat(val)
      return !isNaN(num) && num > 0
    }, {
      message: 'Amount must be greater than 0',
    }),
})

export type SwapSchemaData = z.infer<typeof swapSchema>
