export type CompactStyleType = 'short' | 'long'

export type Unit = 'K' | 'L' | 'Cr'

export type Thresholds = Record<Unit, number>

export interface INRCompactOptions {
  compact?: boolean
  compactMin?: number
  compactStyle?: CompactStyleType
  // Rounding controls (optional)
  // If omitted or false, values are truncated (no rounding)
  round?: boolean
  roundDigits?: number
  roundingMode?: 'none' | 'nearest' | 'down' | 'up'
}

export type RoundingMode = 'none' | 'nearest' | 'down' | 'up'

export interface ParseOptions {
  tolerant?: boolean
  defaultDecimals?: number
}

export interface BreakdownOptions {
  // Indian system only (crore/lakh/thousand/hundred/remainder)
}

export interface ChargeItem {
  name: string
  rate: number // e.g., 0.18 for 18%
}

export interface RoundingOptions {
  precision?: number // digits after decimal
  roundingMode?: RoundingMode
}
