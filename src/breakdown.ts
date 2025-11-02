import type { BreakdownOptions } from './types'

export function breakdown(value: number, _options: BreakdownOptions = {}) {
  const abs = Math.abs(value)
  let integerPart = Math.floor(abs)
  let paise = Math.round((abs - integerPart) * 100)
  
  // Handle case where paise rounds to 100 (carry over to rupees)
  if (paise >= 100) {
    integerPart += 1
    paise = 0
  }
  
  const crore = Math.floor(integerPart / 1_00_00_000)
  let rem = integerPart % 1_00_00_000
  const lakh = Math.floor(rem / 1_00_000)
  rem = rem % 1_00_000
  const thousand = Math.floor(rem / 1000)
  rem = rem % 1000
  const hundred = Math.floor(rem / 100)
  const remainder = rem % 100
  return { crore, lakh, thousand, hundred, remainder, paise }
}
