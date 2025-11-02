const { toINR, toINRWords } = require('../dist/to-indian-currency.cjs.js')

describe('compact basic cases', () => {
  test('standard formatting', () => {
    expect(toINR(11000000)).toBe('\u20B91,10,00,000.00')
  })

  test('compact truncation default', () => {
    expect(toINR(1500, { compact: true })).toBe('\u20B91.5K')
    expect(toINR(1250, { compact: true })).toBe('\u20B91.25K')
    expect(toINR(12344, { compact: true })).toBe('\u20B912.344K')
    expect(toINR(150000, { compact: true })).toBe('\u20B91.5L')
    expect(toINR(32000000, { compact: true })).toBe('\u20B93.2Cr')
    expect(toINR(-150000, { compact: true })).toBe('-\u20B91.5L')
  })

  test('rounding options', () => {
    expect(toINR(12503, { compact: true, round: true })).toBe('\u20B912.5K')
    expect(toINR(12454, { compact: true, round: true, roundDigits: 2, roundingMode: 'down' })).toBe('\u20B912.45K')
    expect(toINR(12456, { compact: true, round: true, roundDigits: 2, roundingMode: 'up' })).toBe('\u20B912.46K')
  })

  test('long style', () => {
    expect(toINR(1500, { compact: true, compactStyle: 'long' })).toBe('\u20B91.5 Thousand')
  })

  test('none rounding fixed decimals', () => {
    expect(toINR(12506, { compact: true, round: true, roundingMode: 'none' })).toBe('\u20B912.50K')
  })

  test('compactMin behavior', () => {
    expect(toINR(999, { compact: true, compactMin: 1000 })).toBe('\u20B9999.00')
  })

  test('words basic sanity', () => {
    expect(toINRWords(205030.75).toLowerCase()).toContain('lakh')
  })

  test('unknown options throw', () => {
    expect(() => toINR(1000, { compact: true, foo: true })).toThrow(/options\.foo is not supported/)
  })

  test('thresholds throws', () => {
    expect(() => toINR(250000, { compact: true, thresholds: { K: 1000, L: 200000, Cr: 10000000 } })).toThrow(/options\.thresholds is not supported/)
  })
})

