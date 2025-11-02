const { toINR } = require('../dist/to-indian-currency.cjs.js')

describe('boundaries', () => {
  test('compactMin and thousand', () => {
    expect(toINR(999, { compact: true })).toBe('\u20B9999.00')
    expect(toINR(1000, { compact: true })).toBe('\u20B91K')
    expect(toINR(1500, { compact: true })).toBe('\u20B91.5K')
  })

  test('lakh boundary', () => {
    expect(toINR(99999, { compact: true, round: true, roundingMode: 'none' })).toBe('\u20B999.99K')
    expect(toINR(100000, { compact: true })).toBe('\u20B91L')
    expect(toINR(150000, { compact: true })).toBe('\u20B91.5L')
  })

  test('crore boundary', () => {
    expect(toINR(9999999, { compact: true, round: true, roundingMode: 'none' })).toBe('\u20B999.99L')
    expect(toINR(10000000, { compact: true })).toBe('\u20B91Cr')
    expect(toINR(32000000, { compact: true })).toBe('\u20B93.2Cr')
  })

  test('custom compactMin', () => {
    expect(toINR(5000, { compact: true, compactMin: 10000 })).toBe('\u20B95,000.00')
  })
})
