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
  
  // Determine sign and work with absolute value for words
  const sign = amount < 0 ? 'Minus ' : ''
  const abs = Math.abs(amount)

  // Special case for absolute zero
  if (abs === 0) {
    return 'Zero Rupees'
  }

  let integerPart = Math.floor(abs)
  let paise = Math.round((abs - integerPart) * 100)

  // carry if paise rounds to 100
  if (paise >= 100) {
    integerPart += 1
    paise = 0
  }

  const rupeeBase = integerPart === 0 ? 'Zero' : formatToIndianWords(integerPart)
  const rupeeLabel = integerPart === 1 ? 'Rupee' : 'Rupees'
  const rupeeWords = `${sign}${rupeeBase} ${rupeeLabel}`

  const paiseLabel = paise === 1 ? 'Paisa' : 'Paise'
  const paiseWords = paise > 0 ? ` and ${toWords(paise)} ${paiseLabel}` : ''

  // Title Case output for consistency with README examples; keep 'and' lowercase
  const full = rupeeWords + paiseWords
  return titleCase(full)
}

function titleCase(input: string): string {
  const minor = new Set(['and'])
  return input
    .split(' ')
    .map((word, idx) => {
      if (!word) return word
      const lower = word.toLowerCase()
      if (idx > 0 && minor.has(lower)) return lower
      return lower
        .split('-')
        .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join('-')
    })
    .join(' ')
}

