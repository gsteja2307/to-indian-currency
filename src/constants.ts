// Constants used across the library

export const DEFAULT_LOCALE = 'en-IN' as const
export const DEFAULT_CURRENCY = 'INR' as const
export const DEFAULT_FRACTION_DIGITS = 2 as const

// Default compact thresholds for Indian numbering system
// K: Thousand, L: Lakh, Cr: Crore
export const DEFAULT_THRESHOLDS = Object.freeze({
  K: 1_000,
  L: 1_00_000,
  Cr: 1_00_00_000
})

export const SUFFIX_SHORT = Object.freeze({ K: 'K', L: 'L', Cr: 'Cr' })
export const SUFFIX_LONG = Object.freeze({ K: 'Thousand', L: 'Lakh', Cr: 'Crore' })

export const VALID_COMPACT_STYLES = ['short', 'long'] as const
