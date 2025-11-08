import { toWords } from 'number-to-words'

/**
 * Convert a non-negative integer to Indian numbering words.
 * Notes:
 * - Expects an integer; any fractional part should be handled by caller.
 * - For amounts with paise/decimals or negative values, use higher-level `toINRWords`.
 */
export function formatToIndianWords(number: number): string {
  const units = [
    { value: 10000000, name: 'Crore' },
    { value: 100000, name: 'Lakh' },
    { value: 1000, name: 'Thousand' },
    { value: 100, name: 'Hundred' }
  ]

  let words = ''
  let remainder = number

  for (let i = 0; i < units.length; i++) {
    const { value, name } = units[i]
    const quotient = Math.floor(remainder / value)
    if (quotient > 0) {
      words += `${toWords(quotient)} ${name} `
      remainder = remainder % value
    }
  }

  if (remainder > 0) {
    words += `${toWords(remainder)}`
  }

  return words.trim()
}
