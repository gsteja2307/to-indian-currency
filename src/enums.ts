// Enums (frozen objects) for constrained values

export const CompactStyle = Object.freeze({
  SHORT: 'short',
  LONG: 'long'
} as const)

export const Unit = Object.freeze({
  K: 'K',
  L: 'L',
  Cr: 'Cr'
} as const)
