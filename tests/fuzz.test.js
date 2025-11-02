const assert = require('assert')
const { toINR } = require('../dist/to-indian-currency.cjs.js')

function rand(seed) {
  // simple LCG for deterministic fuzzing
  let s = seed >>> 0
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000
}

const rng = rand(123456)

const S = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })

test('fuzz 300 random cases', () => {
  for (let i = 0; i < 300; i++) {
    // generate values in [-1e12, 1e12)
    const sign = rng() < 0.5 ? -1 : 1
    const mag = Math.floor(rng() * 12) // exponent
    const base = (rng() * 10) ** mag
    const frac = rng()
    const val = sign * (base + frac)

    // Standard formatting should always succeed and end with 2 decimals
    const std = toINR(val)
    assert.strictEqual(typeof std, 'string')
    assert.ok(/^\D.*\d{2}$/.test(std), `std has 2 decimals: ${std}`)

    // Compact disabled for abs < compactMin
    const min = 1000 + Math.floor(rng() * 9000)
    const cmp1 = toINR(val, { compact: true, compactMin: min })
    if (Math.abs(val) < min) {
      assert.strictEqual(cmp1, S.format(val))
    } else {
      assert.strictEqual(typeof cmp1, 'string')
    }

    // Compact with default settings should use appropriate suffix when abs >= 1000
    const cmp2 = toINR(val, { compact: true })
    if (Math.abs(val) >= 1000) {
      assert.match(cmp2, /^-?\D.*(K|L|Cr)$/)
    }

    // 'none' rounding shows fixed 2 decimals in numeric part when compacting
    const cmp3 = toINR(val, { compact: true, round: true, roundingMode: 'none' })
    if (Math.abs(val) >= 1000) {
      assert.match(cmp3, /^-?\D\d+\.\d{2}(K|L|Cr)$/)
    }
  }
})
