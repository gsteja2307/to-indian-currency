### `CHANGELOG.md`

To document version changes and improvements.

# Changelog

All notable changes to this project will be documented in this file.

## [2.1.1]
## [2.1.0]
### Added
- Validation for GST rates and charges: throw on non-finite values.
- Input validation in CLI for numbers, `--decimals`, and `--rate`; friendly error messages.
- CLI: `--compactStyle=short|long` flag wired to `format` command.
- roundValue: input guards for value, digits, and mode.

### Fixed
- applyCharges: validates items and rates to prevent NaN propagation.

### Docs
- README: notes on standard rounding via `Intl.NumberFormat` and floating-point considerations for paise in `breakdown`.

## [2.0.5] - 2025-11-08
### Breaking
- breakdown(): returns a `sign` field (`-1 | 0 | 1`) and keeps all buckets non-negative. The returned object shape now includes `sign` and may require consumer updates.

### Added
- toINRWords(): Title Case output for consistency with README; keeps conjunction "and" lowercase; hyphenated numbers are title-cased (e.g., `Seventy-Five`).
- toINRWords(): Singular/plural grammar — `1` → "Rupee"/"Paisa", others → "Rupees"/"Paise".
- parseWords(): Input type validation with clear error; optional support for `minus …` prefix and parentheses negatives.
- Tests: negative words scenarios, zero-rupees words, and parseWords compound/unit cases.

### Fixed
- toINRWords(): Correct negative handling — compute on absolute value and prefix "Minus "; carry when paise rounds to 100; ensure integer part renders for sub-rupee amounts (e.g., `-0.5` → "Minus Zero Rupees and Fifty Paise").
- parseWords(): Properly handles standalone "zero"/"Zero Rupees"; verified additive composition for multi-digit phrases (e.g., "Twenty Five" → `25`, "Ninety-Nine" → `99`).
- parse(): Validates final numeric result and throws if not a finite number (e.g., Infinity/NaN cases).

### Docs
- README: Documented `breakdown` sign semantics (`-1 | 0 | 1`), and clarified `parse`/`expandCompact` supported formats (no scientific notation in compact).

## [2.0.4] - 2025-11-02
### Added
- **breakdown() now includes paise field**: The `breakdown()` function now returns a `paise` field (0-99) representing the decimal part of the amount, ensuring no data loss for financial calculations.
  - Example: `breakdown(123456.75)` → `{ crore: 0, lakh: 1, thousand: 23, hundred: 4, remainder: 56, paise: 75 }`
  - Properly handles edge cases where paise rounds to 100 (carries over to rupees)
  - Maintains backward compatibility - existing code continues to work
  - Consistent with `toINRWords()` which also handles paise

### Changed
- **breakdown() decimal handling**: Previously, decimal parts were silently discarded using `Math.floor()`. Now they are preserved as paise for complete financial accuracy.

## [2.0.3] - 2025-11-02
### Fixed
- npm install failure: include `scripts/postinstall.js` in published files to prevent MODULE_NOT_FOUND during postinstall.

## [2.0.2] - 2025-11-02
## [2.0.1] - 2025-11-02
### Added
- README: Playground link (https://gsuryateja.com/to-indian-currency/) and more examples.

## [2.0.0] - 2025-11-01
### Added
- Compact notation for Indian currency (K / L / Cr) with configurable rounding:
  - `round`, `roundDigits`, `roundingMode: 'none' | 'nearest' | 'down' | 'up'`
- Parsing utilities:
  - `parse('₹12,34,567.50', { tolerant, defaultDecimals })` → `1234567.5`
  - Handles `₹`, `Rs.`, `INR`, spaces, parentheses for negatives, compact units (e.g., `12.3L`), and mixed junk (e.g., `INR 1,23,000/-`).
  - `expandCompact('2.5Cr')` → `25000000`
  - `parseWords('One Crore Two Lakh Five Thousand')` → `12050000`
- Breakdown utilities:
  - `breakdown(123456789)` → `{ crore: 12, lakh: 34, thousand: 56, hundred: 7, remainder: 89 }`
  - Western system supported: `{ billion, million, thousand, hundred, remainder }`
- GST & tax math:
  - `addGST(base, 18)` and `splitGST(total, 18)` with `{ precision, roundingMode }`
  - Generic charges pipeline: `applyCharges(base, [{ name: 'GST', rate: 0.18 }, { name: 'Cess', rate: 0.01 }])`
- CLI (`npx to-indian-currency`): subcommands `format`, `parse`, `words`, `breakdown`, `expand`, `gst add|split`, `charges` with `--json` output.
- Test harness migrated to Jest with fuzz and edge-case coverage.
### Changed
- Codebase migrated to TypeScript with runtime validation and organized modules (constants, enums, utils).
- Added `types` and `exports` in package.json for first-class ESM and CJS compatibility.
- BREAKING: stricter input validation now throws `TypeError` for non-number inputs and unknown options.
- BREAKING: thresholds are no longer configurable; fixed Indian K/L/Cr units are always used.
- Build is now ES + CJS (replaced UMD) to reduce size.
- Always-obfuscated builds; added minimal banner in bundles linking to `dist/THIRD_PARTY_LICENSES.txt`.

## [1.0.0] - 04-11-2024
### Added
- Initial release of `to-indian-currency`.
- `toINR` function to format numbers into Indian Rupee format (e.g., `₹1,10,00,000.00`).
- `toINRWords` function to convert numbers to words in Indian currency format.
- Paise support for decimal numbers (e.g., `Seventy-Five Paise`).
