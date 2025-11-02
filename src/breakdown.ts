import type { BreakdownOptions } from './types'

export function breakdown(value: number, _options: BreakdownOptions = {}) {
  const abs = Math.floor(Math.abs(value))
  const crore = Math.floor(abs / 1_00_00_000)
  let rem = abs % 1_00_00_000
  const lakh = Math.floor(rem / 1_00_000)
  rem = rem % 1_00_000
  const thousand = Math.floor(rem / 1000)
  rem = rem % 1000
  const hundred = Math.floor(rem / 100)
  const remainder = rem % 100
  return { crore, lakh, thousand, hundred, remainder }
}
