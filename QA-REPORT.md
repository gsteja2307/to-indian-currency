# QA Report (v2.0.4)

Scope: Third-party QA pass across library APIs, CLI, docs, and bundles. Methods included unit tests, fuzz/property tests, and targeted ad‑hoc scenarios (positive, negative, extremes).

Test Environment
- Node 20.x (Windows), PowerShell/Command Prompt
- Build via `vite`, tests via `jest`
- Artifacts used: `dist/to-indian-currency.cjs.js`

Summary
- Test suites: 8 total → 7 passed, 1 failed
- Fuzz: 300 random cases (existing) passed
- Property checks: parse(toINR(x)) ≈ round2(x) for 200 random x → passed

Automated Results
- Standard formatting: passed
- Compact formatting and rounding modes (nearest/down/up/none): passed
- Boundaries around K/L/Cr thresholds: passed
- Parsing (symbols, commas, tolerant junk, defaultDecimals): passed
- expandCompact (₹/INR/Rs tokens, signs, spacing): passed
- GST add/split and generic charges pipeline: passed
- Breakdown: 1 failing expectation (see Issue B1)
- Words: functional for positive integers but multiple correctness gaps (see Issues W1–W3)

Additional Ad‑hoc Tests
- parse(toINR(n)) equals `Math.round(n*100)/100` across ±1e6 random values → OK
- expandCompact accepts `-INR 2.5Cr`, `Rs.1.5L`, `₹1K` → OK
- breakdown handles paise rounding overflow (e.g., 1.995 → remainder 2, paise 0) → OK
- Negative numbers across rounding modes: consistent with spec → OK

Issues Found

- B1: Breakdown object shape mismatches test expectation
  - Repro: `breakdown(123456789)`
    - Actual: `{ crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89, paise: 0 }`
    - Expected by tests: `{ crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89 }` (no `paise` key)
  - Impact: 1 failing test; ambiguous public API
  - Suggestion: Pick one contract and align code/docs/tests. Given docs show `paise` (including 0), either:
    - Update tests to include `paise: 0`, or
    - Change `breakdown` to omit `paise` when 0 and update docs accordingly.

- W1: `toINRWords` does not handle zero
  - Repro: `toINRWords(0)` → " Rupees"
  - Expected: "Zero Rupees"
  - Impact: Incorrect copy for zero amounts
  - Suggestion: Special-case zero to return "Zero Rupees" (optionally “Zero Rupees and Zero Paise” if you later support a flag).

- W2: `toINRWords` does not handle negatives
  - Repro: `toINRWords(-1.5)` → " Rupees and fifty Paise"
  - Expected: "Minus One Rupee and Fifty Paise" (or throw a clear error if negatives unsupported)
  - Impact: Missing rupee words, leading whitespace, no sign semantics
  - Suggestion: Use absolute value for words, prefix "Minus ", ensure integer part renders when 0 < abs(amount) < 1.

- W3: Casing/grammar of words differ from README examples
  - Repro: `toINRWords(205030.75)` → "two Lakh five Thousand thirty Rupees and seventy-five Paise"
  - README shows Title Case: "Two Lakh Five Thousand Thirty Rupees and Seventy-Five Paise"
  - Impact: Inconsistent presentation
  - Suggestion: Apply Title Case post-processing; consider singular/plural tweaks ("Rupee" vs "Rupees", "Paisa" vs "Paise").

- D1: Rupee symbol mojibake in docs and some test text
  - Observation: Several places show a garbled symbol instead of `₹`
  - Impact: Confusing docs; potential copy/paste errors
  - Suggestion: Normalize repo encoding to UTF‑8 and replace all symbols with literal `₹`. Runtime outputs already print `₹` correctly via `Intl.NumberFormat`.

Notes and Behaviors Verified
- `toINR` uses Indian grouping with 2 decimals; symbol from `Intl.NumberFormat('en-IN', { currency: 'INR' })`.
- Compact formatting:
  - Default is truncation (no rounding); trailing zeros removed
  - Rounding is opt-in (`round: true` or providing `roundDigits`/`roundingMode`)
  - `compactStyle: 'long'` inserts a space before the suffix (e.g., `₹1.5 Lakh`)
- Parsing:
  - Parentheses for negatives `(₹1,234.00)` → `-1234`
  - `defaultDecimals` applies only if no decimal in input
  - Tolerant mode extracts first numeric token when junk present
- expandCompact:
  - Accepts optional `₹`/`Rs.`/`INR` tokens and leading sign
  - Supports `K`, `L`, `Cr` (case-insensitive where appropriate)
- Breakdown:
  - Operates on absolute value; consider documenting or returning sign separately if needed
  - Correctly carries paise rounding to rupees when paise rounds to 100
- GST & Charges:
  - Rounding options mirror compact rounding semantics; works for negative rates (discounts)

Recommended Follow-ups
- Decide and unify the `breakdown` API (B1). Update tests/docs accordingly.
- Fix `toINRWords` for zero/negatives and align casing with README (W1–W3). Add tests.
- Sweep README/tests to replace mojibake with `₹` (D1).
- Optional: add property tests for `parseWords(toINRWords(n)) === n` for a positive integer range once W1–W3 are addressed.

Reproduction Snippets
```js
// B1
const { breakdown } = require('to-indian-currency')
console.log(breakdown(123456789))
// => { crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89, paise: 0 }

// W1
const { toINRWords } = require('to-indian-currency')
console.log(toINRWords(0))
// => " Rupees" (expected: "Zero Rupees")

// W2
console.log(toINRWords(-1.5))
// => " Rupees and fifty Paise" (expected: "Minus One Rupee and Fifty Paise")

// W3
console.log(toINRWords(205030.75))
// => "two Lakh five Thousand thirty Rupees and seventy-five Paise"
```

Version
- Library: 2.0.4
- Date: QA run appended

