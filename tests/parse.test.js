const { parse, expandCompact } = require('../dist/to-indian-currency.cjs.js')

describe('parse currency strings', () => {
  test('basic with symbol and commas', () => {
    expect(parse('₹12,34,567.50')).toBe(1234567.5)
    expect(parse('INR 1,23,000/-', { tolerant: true })).toBe(123000)
    expect(parse('(₹1,234.00)')).toBe(-1234)
    expect(parse('Rs. 1,234')).toBe(1234)
  })

  test('tolerant with junk', () => {
    expect(parse('foo INR 1,23,000 bar/-', { tolerant: true })).toBe(123000)
  })

  test('defaultDecimals when no decimal in input', () => {
    expect(parse('₹123', { tolerant: true, defaultDecimals: 2 })).toBe(1.23)
  })

  test('accept western grouped numeric and format to Indian', () => {
    const n = parse('1,234,567.89')
    expect(n).toBe(1234567.89)
  })
})

describe('expandCompact', () => {
  test('units', () => {
    expect(expandCompact('2.5Cr')).toBe(25000000)
    expect(expandCompact('1.5L')).toBe(150000)
    expect(expandCompact('1K')).toBe(1000)
    expect(expandCompact('₹3L')).toBe(300000)
  })
})
