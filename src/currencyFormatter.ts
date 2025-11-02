import { CompactStyle } from './enums'
import { formatCurrencyCompact, formatCurrencyStandard } from './utils/format'
import { validateAmount, validateToINROptions } from './utils/validation'
import { formatToIndianWords } from './utils/words'
import { toWords } from 'number-to-words'
import type { INRCompactOptions } from './types'

/**
 * Format a number to Indian Rupee currency string.
 * Supports compact notation via options.
 */
export function toINR(amount: number, options: INRCompactOptions = {}): string {
  validateAmount(amount)
  validateToINROptions(options)

  const { compact = false, compactStyle = CompactStyle.SHORT } = options

  if (compact) {
    return formatCurrencyCompact(amount, { ...options, compactStyle })
  }

  return formatCurrencyStandard(amount)
}

/**
 * Convert number to Indian currency in words
 * (e.g., "Two Lakh Five Thousand Thirty Rupees").
 */
export function toINRWords(amount: number): string {
  validateAmount(amount)
  const integerPart = Math.floor(amount)
  const decimalPart = Math.round((amount - integerPart) * 100)
  const rupeeWords = `${formatToIndianWords(integerPart)} Rupees`
  const paiseWords = decimalPart > 0 ? ` and ${toWords(decimalPart)} Paise` : ''
  return rupeeWords + paiseWords
}

