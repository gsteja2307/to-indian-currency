import type { RoundingMode } from '../types'

export function roundValue(value: number, digits: number, mode: RoundingMode = 'nearest'): number {
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

