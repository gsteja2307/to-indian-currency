import { VALID_COMPACT_STYLES } from '../constants'
import type { ChargeItem } from '../types'

/**
 * Validate the amount argument
 * @param {unknown} amount
 */
export function validateAmount(amount: unknown): asserts amount is number {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new TypeError('toINR: amount must be a finite number')
  }
}

/**
 * Validate options passed to toINR
 * @param {import('../types').INRCompactOptions | undefined} options
 */
import type { INRCompactOptions } from '../types'

export function validateToINROptions(options: INRCompactOptions | undefined): void {
  if (options == null) return
  const { compact, compactMin, compactStyle, round, roundDigits, roundingMode } = options

  if (compact !== undefined && typeof compact !== 'boolean') {
    throw new TypeError('toINR: options.compact must be a boolean')
  }
  if (compactMin !== undefined) {
    if (typeof compactMin !== 'number' || !Number.isFinite(compactMin) || compactMin < 0) {
      throw new TypeError('toINR: options.compactMin must be a non-negative finite number')
    }
  }
  if (compactStyle !== undefined) {
    if (typeof compactStyle !== 'string' || !VALID_COMPACT_STYLES.includes(compactStyle)) {
      throw new TypeError("toINR: options.compactStyle must be 'short' or 'long'")
    }
  }
  if (round !== undefined && typeof round !== 'boolean') {
    throw new TypeError('toINR: options.round must be a boolean')
  }
  if (roundDigits !== undefined) {
    if (typeof roundDigits !== 'number' || !Number.isFinite(roundDigits) || roundDigits < 0 || !Number.isInteger(roundDigits)) {
      throw new TypeError('toINR: options.roundDigits must be a non-negative integer')
    }
  }
  if (roundingMode !== undefined) {
    const modes = ['none', 'nearest', 'down', 'up'] as const
    if (typeof roundingMode !== 'string' || !modes.includes(roundingMode as any)) {
      throw new TypeError("toINR: options.roundingMode must be 'none', 'nearest', 'down', or 'up'")
    }
  }
  // Explicitly reject deprecated 'thresholds'
  if (Object.prototype.hasOwnProperty.call(options as Record<string, unknown>, 'thresholds')) {
    throw new TypeError('toINR: options.thresholds is not supported')
  }
  // Disallow unknown options
  const allowed = new Set(['compact', 'compactMin', 'compactStyle', 'round', 'roundDigits', 'roundingMode'])
  for (const key of Object.keys(options as Record<string, unknown>)) {
    if (!allowed.has(key)) {
      throw new TypeError(`toINR: options.${key} is not supported`)
    }
  }
}

/**
 * Assert that a value is a finite number
 */
export function assertFinite(label: string, value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${label}: must be a finite number`)
  }
}

/**
 * Validate a rate (percentage or ratio) is a finite number
 */
export function assertRate(label: string, rate: unknown): asserts rate is number {
  if (typeof rate !== 'number' || !Number.isFinite(rate)) {
    throw new TypeError(`${label}: rate must be a finite number`)
  }
}

/**
 * Validate charge items structure
 */
export function validateChargeItems(items: ChargeItem[]): void {
  if (!Array.isArray(items)) {
    throw new TypeError('applyCharges: items must be an array')
  }
  for (const it of items) {
    if (!it || typeof it.name !== 'string') {
      throw new TypeError('applyCharges: each item must have a string name')
    }
    if (typeof (it as any).rate !== 'number' || !Number.isFinite((it as any).rate)) {
      throw new TypeError(`applyCharges: rate for '${it.name}' must be a finite number`)
    }
  }
}
