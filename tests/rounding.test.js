const { toINR } = require('../dist/to-indian-currency.cjs.js')

describe('rounding modes (positive & negative)', () => {
  test('nearest (default when round: true)', () => {
    expect(toINR(12503, { compact: true, round: true })).toBe('\u20B912.5K')
    expect(toINR(12505, { compact: true, round: true, roundDigits: 2 })).toBe('\u20B912.51K')
    expect(toINR(12456, { compact: true, round: true, roundDigits: 2 })).toBe('\u20B912.46K')
  })

  test('down (toward zero)', () => {
    expect(toINR(12459, { compact: true, round: true, roundDigits: 2, roundingMode: 'down' })).toBe('\u20B912.45K')
  })

  test('up (away from zero)', () => {
    expect(toINR(12451, { compact: true, round: true, roundDigits: 2, roundingMode: 'up' })).toBe('\u20B912.46K')
  })

  test('none (truncate fixed decimals)', () => {
    expect(toINR(12506, { compact: true, round: true, roundingMode: 'none' })).toBe('\u20B912.50K')
    expect(toINR(12506, { compact: true, round: true, roundingMode: 'none', roundDigits: 3 })).toBe('\u20B912.506K')
  })

  test('negative numbers', () => {
    expect(toINR(-150000, { compact: true })).toBe('-\u20B91.5L')
    expect(toINR(-12456, { compact: true, round: true, roundDigits: 2, roundingMode: 'up' })).toBe('-\u20B912.46K')
  })
})
