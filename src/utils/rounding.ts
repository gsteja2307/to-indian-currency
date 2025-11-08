import type { RoundingMode } from '../types'

export function roundValue(value: number, digits: number, mode: RoundingMode = 'nearest'): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('roundValue: value must be a finite number')
  }
  if (!Number.isInteger(digits) || digits < 0) {
    throw new TypeError('roundValue: digits must be a non-negative integer')
  }
  const modes: ReadonlyArray<RoundingMode> = ['none', 'nearest', 'down', 'up']
  if (!modes.includes(mode)) {
    throw new TypeError("roundValue: mode must be 'none', 'nearest', 'down', or 'up'")
  }
  const factor = Math.pow(10, digits)
  if (mode === 'none') {
    const truncated = value >= 0 ? Math.floor(value * factor) / factor : Math.ceil(value * factor) / factor
    return truncated
  }
  if (mode === 'nearest') return Math.round(value * factor) / factor
  if (mode === 'down') {
    const op = value >= 0 ? Math.floor : Math.ceil
    return op(value * factor) / factor
  }
  if (mode === 'up') {
    const op = value >= 0 ? Math.ceil : Math.floor
    return op(value * factor) / factor
  }
  return value
}

