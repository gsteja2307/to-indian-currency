const { toINR } = require('../dist/to-indian-currency.cjs.js')

describe('standard INR formatting', () => {
  test('basic values and grouping', () => {
    expect(toINR(0)).toBe('\u20B90.00')
    expect(toINR(1)).toBe('\u20B91.00')
    expect(toINR(999.4)).toBe('\u20B9999.40')
    expect(toINR(1000)).toBe('\u20B91,000.00')
    expect(toINR(100000)).toBe('\u20B91,00,000.00')
    expect(toINR(11000000)).toBe('\u20B91,10,00,000.00')
  })

  test('always 2 decimals', () => {
    expect(toINR(12.3)).toBe('\u20B912.30')
    expect(toINR(12.3456)).toBe('\u20B912.35')
  })
})
