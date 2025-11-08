import type { ChargeItem, RoundingOptions } from './types'
import { roundValue } from './utils/rounding'
import { assertFinite, validateChargeItems } from './utils/validation'

export function applyCharges(base: number, items: ChargeItem[], options: RoundingOptions = {}) {
  assertFinite('applyCharges: base', base)
  validateChargeItems(items)
  const precision = options.precision ?? 2
  const mode = options.roundingMode ?? 'nearest'
  const charges = [] as Array<{ name: string, amount: number }>
  for (const it of items) {
    const amount = roundValue(base * it.rate, precision, mode)
    charges.push({ name: it.name, amount })
  }
  const totalCharges = charges.reduce((a, c) => a + c.amount, 0)
  const total = roundValue(base + totalCharges, precision, mode)
  return { base, charges, total, totalCharges }
}

