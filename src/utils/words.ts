import { toWords } from 'number-to-words'

/**
 * Convert a number to Indian numbering words
 * @param {number} number
 * @returns {string}
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
