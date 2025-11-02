const { toINR } = require('../dist/to-indian-currency.cjs.js')

describe('negative rounding behavior', () => {
  test('none: truncate toward zero, fixed digits', () => {
    expect(toINR(-12506, { compact: true, round: true, roundingMode: 'none' })).toBe('-\u20B912.50K')
    expect(toINR(-12506, { compact: true, round: true, roundingMode: 'none', roundDigits: 3 })).toBe('-\u20B912.506K')
  })

  test('down: toward zero', () => {
    expect(toINR(-12459, { compact: true, round: true, roundDigits: 2, roundingMode: 'down' })).toBe('-\u20B912.45K')
  })

  test('up: away from zero', () => {
    expect(toINR(-12451, { compact: true, round: true, roundDigits: 2, roundingMode: 'up' })).toBe('-\u20B912.46K')
  })
})
