const { breakdown, addGST, splitGST, applyCharges } = require('../dist/to-indian-currency.cjs.js')

describe('breakdown', () => {
  test('indian only (positive)', () => {
    expect(breakdown(123456789)).toEqual({ sign: 1, crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89, paise: 0 })
  })

  test('preserves sign for negative input', () => {
    expect(breakdown(-123456789)).toEqual({ sign: -1, crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89, paise: 0 })
  })
})

describe('GST & charges', () => {
  test('add and split GST', () => {
    const { total, tax } = addGST(100, 18, { precision: 2, roundingMode: 'nearest' })
    expect(total).toBe(118)
    expect(tax).toBe(18)
    const s = splitGST(total, 18, { precision: 2, roundingMode: 'nearest' })
    expect(s.base).toBe(100)
    expect(s.tax).toBe(18)
  })

  test('applyCharges pipeline', () => {
    const res = applyCharges(100, [ { name: 'GST', rate: 0.18 }, { name: 'Cess', rate: 0.01 } ], { precision: 2, roundingMode: 'nearest' })
    expect(res.total).toBe(119)
    expect(res.totalCharges).toBe(19)
    expect(res.charges).toEqual(expect.arrayContaining([ expect.objectContaining({ name: 'GST', amount: 18 }), expect.objectContaining({ name: 'Cess', amount: 1 }) ]))
  })

  test('invalid GST rates and inputs throw', () => {
    const { addGST, splitGST } = require('../dist/to-indian-currency.cjs.js')
    expect(() => addGST(100, Number.NaN)).toThrow(/must be a finite number/)
    expect(() => addGST(100, Infinity)).toThrow(/must be a finite number/)
    expect(() => splitGST(100, Number.NaN)).toThrow(/must be a finite number/)
  })

  test('applyCharges validates items', () => {
    const { applyCharges } = require('../dist/to-indian-currency.cjs.js')
    expect(() => applyCharges(100, [{ name: 'Tax', rate: Number.NaN }])).toThrow(/must be a finite number/)
    expect(() => applyCharges(100, [{ name: 'Tax', rate: 'abc' }])).toThrow(/must be a finite number/)
  })
})
