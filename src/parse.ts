import type { ParseOptions } from './types'

const CURRENCY_TOKENS = [
  'inr', 'rs', 'rs.', '₹', 'rupee', 'rupees'
]

const COMPACT_MAP: Record<string, number> = {
  k: 1_000,
  K: 1_000,
  l: 1_00_000,
  L: 1_00_000,
  cr: 1_00_00_000,
  CR: 1_00_00_000,
  Cr: 1_00_00_000,
}

export function expandCompact(input: string): number | null {
  const s = input.trim()
  const m = s.match(/^([-+])?\s*(?:₹|Rs\.?|INR)?\s*([0-9]+(?:\.[0-9]+)?)\s*([Kk]|[Ll]|[Cc][Rr])\s*$/)
  if (!m) return null
  const sign = m[1] === '-' ? -1 : 1
  const num = parseFloat(m[2])
  const unit = m[3]
  const factor = COMPACT_MAP[unit] ?? 1
  return sign * num * factor
}

export function parse(input: string, options: ParseOptions = {}): number {
  const tolerant = !!options.tolerant
  let s = input.trim()

  // Handle parentheses for negatives
  let negative = false
  if (/^\(.*\)$/.test(s)) {
    negative = true
    s = s.slice(1, -1)
  }

  // Try compact first
  const ec = expandCompact(s)
  if (ec != null) {
    return negative ? -ec : ec
  }

  // Remove currency tokens and slashes, trailing '/-'
  s = s.replace(/\/-$/,'')
  s = s.replace(/[\s,]+/g, '')
  s = s.replace(/[₹]/g, '')
  s = s.replace(/^(?:INR|inr|Rs\.?|rs\.?)/, '')
  // Detect explicit sign
  if (s.startsWith('-')) { negative = !negative; s = s.slice(1) }
  if (s.startsWith('+')) { s = s.slice(1) }

  // Now s should be digits with optional decimal point
  if (!/^[0-9]+(?:\.[0-9]+)?$/.test(s)) {
    if (!tolerant) throw new Error(`Invalid currency string: ${input}`)
    // Extract first numeric pattern (including decimal)
    const m = s.match(/([0-9]+(?:\.[0-9]+)?)/)
    if (!m) throw new Error(`Invalid currency string: ${input}`)
    s = m[1]
  }

  // defaultDecimals behavior: if no decimal point and option provided
  if (options.defaultDecimals && !s.includes('.')) {
    const div = Math.pow(10, options.defaultDecimals)
    const intVal = parseInt(s, 10)
    const value = intVal / div
    return negative ? -value : value
  }

  const value = parseFloat(s)
  const signed = negative ? -value : value
  if (!Number.isFinite(signed)) {
    throw new TypeError('parse: result is not a finite number')
  }
  return signed
}

// Parse words like 'One Crore Two Lakh Five Thousand'
const NUM_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90
}

function parseChunk(words: string[]): number {
  let total = 0
  let current = 0
  for (const w of words) {
    if (w === 'hundred') {
      current *= 100
    } else if (NUM_WORDS[w] != null) {
      current += NUM_WORDS[w]
    }
  }
  total += current
  return total
}

export function parseWords(input: string): number {
  if (typeof input !== 'string') {
    throw new TypeError('parseWords: input must be a string')
  }
  let s = input.toLowerCase().replace(/[-,]/g, ' ')
  // optional prefix sign support (e.g., 'minus') or parentheses
  let negative = false
  if (/^\(.*\)$/.test(s)) {
    negative = true
    s = s.slice(1, -1)
  }
  s = s.replace(/^(minus)\b\s*/, (_m) => { negative = true; return '' })
  s = s.replace(/\band\b/g, ' ')
  s = s.replace(/\brupees?\b/g, ' ')
  s = s.replace(/\bpaise?\b/g, ' ')
  s = s.replace(/\s+/g, ' ').trim()

  const units = [ { key: 'crore', val: 1_00_00_000 }, { key: 'lakh', val: 1_00_000 }, { key: 'thousand', val: 1000 }, { key: 'hundred', val: 100 } ]
  let total = 0
  let rest = s
  for (const { key, val } of units) {
    const idx = rest.indexOf(key)
    if (idx !== -1) {
      const before = rest.slice(0, idx).trim()
      const tokens = before.split(' ').filter(Boolean)
      const amount = parseChunk(tokens)
      total += amount * val
      rest = rest.slice(idx + key.length).trim()
    }
  }
  if (rest) {
    const tokens = rest.split(' ').filter(Boolean)
    total += parseChunk(tokens)
  }
  // handle explicit 'zero'
  if (s === 'zero' || s === '') {
    return 0
  }
  return negative ? -total : total
}

