import type { RoundingOptions } from './types'
import { roundValue } from './utils/rounding'
import { assertFinite, assertRate } from './utils/validation'

export function addGST(base: number, ratePercent: number, options: RoundingOptions = {}) {
  assertFinite('addGST: base', base)
  assertRate('addGST', ratePercent)
  const precision = options.precision ?? 2
  const mode = options.roundingMode ?? 'nearest'
  const tax = roundValue(base * (ratePercent / 100), precision, mode)
  const total = roundValue(base + tax, precision, mode)
  return { total, tax }
}

export function splitGST(total: number, ratePercent: number, options: RoundingOptions = {}) {
  assertFinite('splitGST: total', total)
  assertRate('splitGST', ratePercent)
  const precision = options.precision ?? 2
  const mode = options.roundingMode ?? 'nearest'
  const base = roundValue(total / (1 + ratePercent / 100), precision, mode)
  const tax = roundValue(total - base, precision, mode)
  return { base, tax }
}

