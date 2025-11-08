# to-indian-currency
[![NPM version](https://img.shields.io/npm/v/to-indian-currency.svg)](https://www.npmjs.com/package/to-indian-currency)
[![NPM downloads](https://img.shields.io/npm/dm/to-indian-currency.svg)](https://www.npmjs.com/package/to-indian-currency)
[![GitHub stars](https://img.shields.io/github/stars/gsteja2307/to-indian-currency.svg)](https://github.com/gsteja2307/to-indian-currency/stargazers)

A compact, well‑typed toolkit for Indian currency formatting, parsing, words, breakdowns, and simple tax/charges math — with an optional CLI.

Maintained by: [G Surya Teja](https://github.com/gsteja2307)

Playground: https://gsuryateja.com/to-indian-currency/

## Features
- Format numbers into Indian Rupee (`₹`) with proper grouping (1,10,00,000).
- Compact notation with Indian units: `K`, `L`, `Cr`.
- Rounding controls for compact values: `round`, `roundDigits`, `roundingMode: 'none'|'nearest'|'down'|'up'`.
- Convert amounts to Indian currency words.
- Parse currency strings (₹, Rs., INR, commas, spaces, `/‑`, parentheses, compact notations).
- Expand compact strings (e.g., `2.5Cr` → `25000000`).
- Breakdown amounts into Indian or Western unit buckets.
- GST helpers: add/split tax; generic additive charges pipeline.
- ESM + CJS builds, TypeScript types, Jest tests, and a simple CLI.

## Installation

```bash
npm install to-indian-currency
```

## Quick Start

```ts
// ESM
import { toINR, toINRWords } from 'to-indian-currency'

console.log(toINR(11000000))            // => "₹1,10,00,000.00"
console.log(toINRWords(205030.75))      // => "Two Lakh Five Thousand Thirty Rupees and Seventy-Five Paise"

// Compact (Indian)
console.log(toINR(1500,  { compact: true }))                          // => "₹1.5K"
console.log(toINR(1250,  { compact: true }))                          // => "₹1.25K" (no rounding)
console.log(toINR(12503, { compact: true, round: true }))             // => "₹12.5K" (nearest, 1 digit)
console.log(toINR(12454, { compact: true, round: true, roundDigits: 2, roundingMode: 'down' })) // => "₹12.45K"
console.log(toINR(12456, { compact: true, round: true, roundDigits: 2, roundingMode: 'up' }))   // => "₹12.46K"
console.log(toINR(150000, { compact: true }))                         // => "₹1.5L"
console.log(toINR(32000000, { compact: true }))                       // => "₹3.2Cr"
console.log(toINR(1500,  { compact: true, compactStyle: 'long' }))    // => "₹1.5 Thousand"
```

## API

### format: `toINR(amount: number, options?: INRCompactOptions): string`
Formats a number into the Indian Rupee currency format. When `compact: true`, scales by Indian units.

`INRCompactOptions` (all optional):
- `compact: boolean` — enable compact notation. Default `false`.
- `compactMin: number` — minimum absolute amount to start compacting. Default `1000`.
- `compactStyle: 'short' | 'long'` — suffix style. `short` → `K`, `L`, `Cr`; `long` → `Thousand`, `Lakh`, `Crore`.
- `round: boolean` — enable rounding for compact numbers. Default `false` (truncate behavior).
- `roundDigits: number` — number of digits after the decimal when rounding. Default `1` if `round` is enabled.
- `roundingMode: 'none' | 'nearest' | 'down' | 'up'` — rounding strategy. Default `nearest` when `round` is enabled.

Notes:
- Thresholds are fixed to Indian units and not configurable:
  - `K` (Thousand) = `1,000`
  - `L` (Lakh) = `1,00,000`
  - `Cr` (Crore) = `1,00,00,000`
- Unknown options throw (e.g., `options.foo is not supported`).

Note:
- Standard (non-compact) formatting uses `Intl.NumberFormat` for rounding to 2 decimals, which is spec-compliant and consistent across modern runtimes.

#### Rounding modes
- `nearest`: rounds to the closest value at `roundDigits` precision. Half (.5) rounds up.
  - `toINR(12503, { compact: true, round: true })` → `₹12.5K` (12.503 → 12.5)
  - `toINR(12505, { compact: true, round: true, roundDigits: 2 })` → `₹12.51K` (12.505 → 12.51)
- `down`: rounds toward zero.
  - `toINR(12459, { compact: true, round: true, roundDigits: 2, roundingMode: 'down' })` → `₹12.45K`
- `up`: rounds away from zero.
  - `toINR(12451, { compact: true, round: true, roundDigits: 2, roundingMode: 'up' })` → `₹12.46K`
- `none`: truncates to `roundDigits` (default 2) and shows fixed decimals, no rounding.
  - `toINR(12506, { compact: true, round: true, roundingMode: 'none' })` → `₹12.50K`

### words: `toINRWords(amount: number): string`
Converts a number to Indian currency words. Includes paise if decimals exist.

### parse: `parse(input: string, options?: { tolerant?: boolean, defaultDecimals?: number }): number`
Parses many common string formats:
- Symbols and tokens: `₹`, `Rs.`, `INR`
- Indian commas: `₹1,23,456.78`
- Parentheses for negatives: `(₹1,234.00)` → `-1234`
- Mixed junk (tolerant mode): `foo INR 1,23,000 bar/-` → `123000`
- Compact units: `12.3L` → `1230000` (via `expandCompact` internally)
- `defaultDecimals`: when no decimal point is present, divides by `10^defaultDecimals`.

Notes:
- Validates the final numeric result; throws if it is not a finite number.
- Scientific/exponential notation is not supported in compact strings and may be rejected in parsing depending on format.

Examples:
```js
parse('₹12,34,567.50')                         // 1234567.5
parse('INR 1,23,000/-', { tolerant: true })         // 123000
parse('(₹1,234.00)')                           // -1234
parse('Rs. 123', { tolerant: true, defaultDecimals: 2 }) // 1.23
```

### parseWords: `parseWords(input: string): number`
Parses numbers written in Indian words:
```js
parseWords('One Crore Two Lakh Five Thousand') // 10205000
```

### expandCompact: `expandCompact(input: string): number | null`
Expands strings like:
```js
expandCompact('2.5Cr') // 25000000
expandCompact('1.5L')  // 150000
expandCompact('1K')    // 1000
```

Notes:
- Supports decimal numbers only (no scientific/exponential notation like `1e6`).

### breakdown: `breakdown(value: number)`
Indian system (preserves sign via `sign: -1 | 0 | 1`):
```js
breakdown(123456789)
// { sign: 1, crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89, paise: 0 }

breakdown(123456789.75)
// { sign: 1, crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89, paise: 75 }

breakdown(-123456789)
// { sign: -1, crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89, paise: 0 }
```

Notes:
- The `paise` field represents the decimal portion (0-99 paise, where 100 paise = 1 rupee).
- When paise calculations round to 100, they automatically carry over to rupees (e.g., 1.995 becomes 2 rupees and 0 paise).
- Due to how computers handle decimal numbers, some values like 0.3 may have minor precision differences internally (29.9999... instead of exactly 30). The function uses `Math.round()` to ensure correct integer paise values.

### GST helpers
```js
addGST(100, 18)     // { total: 118, tax: 18 }
splitGST(118, 18)   // { base: 100, tax: 18 }

// Control precision and rounding mode (reuses compact rounding semantics)
addGST(99.9, 18, { precision: 2, roundingMode: 'nearest' })
applyCharges(100, [ { name: 'GST', rate: 0.18 }, { name: 'Cess', rate: 0.01 } ])
// { base: 100, total: 119, totalCharges: 19, charges: [{ name: 'GST', amount: 18 }, { name: 'Cess', amount: 1 }] }
```

## CLI

The CLI mirrors the library. Install and run once via `npx`:

```bash
npx to-indian-currency format 1234567 --compact --decimals=0 --compactStyle=long
npx to-indian-currency parse "INR 1,23,000/-" --tolerant --json
npx to-indian-currency words "One Lakh Five Thousand"
npx to-indian-currency breakdown 123456789 --json
npx to-indian-currency expand "2.5Cr"
npx to-indian-currency gst add 100 --rate=18 --precision=2 --roundingMode=nearest --json
npx to-indian-currency gst split 118 --rate=18 --json
npx to-indian-currency charges 100 --list=GST:0.18,Cess:0.01 --precision=2 --json
```

Flags:
- `--json` to print structured results.
- `--decimals=N` applies to compact rounding.
- `--compactStyle=short|long` controls compact suffix style in CLI.
- `--system=indian` for breakdown.

## Module Support
- ESM: `import { toINR } from 'to-indian-currency'`
- CommonJS: `const { toINR } = require('to-indian-currency')`
- Types: `import type { INRCompactOptions } from 'to-indian-currency'`

## Runtime Targets
- Node LTS and modern browsers.
- No polyfills by default. If targeting very old browsers, you may need polyfills for `Intl.NumberFormat`.

## Tests
- Jest test suite with unit + fuzz tests.
- Run: `npm test`

## License

MIT
