import { DEFAULT_CURRENCY, DEFAULT_FRACTION_DIGITS, DEFAULT_LOCALE, DEFAULT_THRESHOLDS, SUFFIX_LONG, SUFFIX_SHORT } from '../constants'
import { CompactStyle } from '../enums'
import type { INRCompactOptions } from '../types'

/**
 * Format a number in Indian currency format (non-compact)
 */
export function formatCurrencyStandard(amount: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: DEFAULT_FRACTION_DIGITS
  }).format(amount)
}

/**
 * Compact-format an amount using Indian units and thresholds.
 * Never rounds; decimals are truncated and trailing zeros removed.
 */
export function formatCurrencyCompact(amount: number, options: INRCompactOptions): string {
  const { compactMin = 1000, compactStyle = CompactStyle.SHORT } = options || {}

  const thresholds = { ...DEFAULT_THRESHOLDS }
  const absAmount = Math.abs(amount)

  if (absAmount < compactMin) {
    return formatCurrencyStandard(amount)
  }

  // Pick largest matching unit by threshold value
  const unitEntry = Object.entries(thresholds as Record<string, number>)
    .filter(([, v]) => typeof v === 'number' && v > 0 && absAmount >= v)
    .sort((a, b) => b[1] - a[1])[0]

  if (!unitEntry) {
    return formatCurrencyStandard(amount)
  }

  const [unitKey, unitValue] = unitEntry as [keyof typeof SUFFIX_SHORT, number]
  const scaled = absAmount / unitValue

  // Never round by default. If rounding is enabled via options, apply rounding.
  const toNonExponential = (num: number): string => {
    const s = String(num)
    if (!/e/i.test(s)) return s
    const [coeff, expStr] = s.split('e')
    const exp = parseInt(expStr!, 10)
    const [intPart, fracPartRaw] = coeff.split('.') as [string, string | undefined]
    const fracPart = fracPartRaw ?? ''
    if (exp >= 0) {
      const move = exp
      if (fracPart.length <= move) {
        return intPart + fracPart + '0'.repeat(move - fracPart.length)
      }
      return intPart + fracPart.slice(0, move) + '.' + fracPart.slice(move)
    } else {
      const move = -exp
      if (intPart.length <= move) {
        return '0.' + '0'.repeat(move - intPart.length) + intPart + fracPart
      }
      return intPart.slice(0, intPart.length - move) + '.' + intPart.slice(intPart.length - move) + fracPart
    }
  }

  let scaledForOutput = scaled
  const applyRounding = options && (options.round || options.roundDigits !== undefined || options.roundingMode !== undefined)
  const mode = (options && options.roundingMode) || undefined
  const digits = options ? (options.roundDigits ?? (mode === 'none' ? 2 : 1)) : 1
  let numberPart: string
  if (applyRounding && mode === 'none') {
    const factor = Math.pow(10, digits)
    const truncated = (scaled >= 0)
      ? Math.floor(scaled * factor) / factor
      : Math.ceil(scaled * factor) / factor
    numberPart = truncated.toFixed(digits)
  } else {
    if (applyRounding) {
      const factor = Math.pow(10, digits)
      const m = mode ?? 'nearest'
      if (m === 'nearest') {
        scaledForOutput = Math.round(scaled * factor) / factor
      } else if (m === 'down') {
        const op = scaled >= 0 ? Math.floor : Math.ceil
        scaledForOutput = op(scaled * factor) / factor
      } else if (m === 'up') {
        const op = scaled >= 0 ? Math.ceil : Math.floor
        scaledForOutput = op(scaled * factor) / factor
      }
    }
    numberPart = toNonExponential(scaledForOutput)
    if (numberPart.includes('.')) {
      numberPart = numberPart.replace(/\.0+$/, '').replace(/\.(\d*?)0+$/, '.$1').replace(/\.$/, '')
    }
  }

  const suffixMap = compactStyle === CompactStyle.LONG ? SUFFIX_LONG : SUFFIX_SHORT
  const suffix = suffixMap[unitKey] ?? unitKey

  const sign = amount < 0 ? '-' : ''
  const spacer = compactStyle === CompactStyle.LONG ? ' ' : ''
  const currencyParts = new Intl.NumberFormat(DEFAULT_LOCALE, { style: 'currency', currency: DEFAULT_CURRENCY, minimumFractionDigits: 0, maximumFractionDigits: 0 }) as any
  let symbol = '\u20B9'
  if (typeof currencyParts.formatToParts === 'function') {
    const parts = currencyParts.formatToParts(0)
    const symPart = parts.find((p: any) => p.type === 'currency')
    if (symPart && typeof symPart.value === 'string') symbol = symPart.value
  }
  return `${sign}${symbol}${numberPart}${spacer}${suffix}`
}
