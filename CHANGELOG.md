### `CHANGELOG.md`

To document version changes and improvements.

# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2025-11-02
### Added
- README: Playground link (https://gsuryateja.com/to-indian-currency/) and more examples.

## [2.0.0] - 2025-11-01
### Added
- Compact notation for Indian currency (K / L / Cr) with configurable rounding:
  - `round`, `roundDigits`, `roundingMode: 'none' | 'nearest' | 'down' | 'up'`
- Parsing utilities:
  - `parse('\u20B912,34,567.50', { tolerant, defaultDecimals })` → `1234567.5`
  - Handles `\u20B9`, `Rs.`, `INR`, spaces, parentheses for negatives, compact units (e.g., `12.3L`), and mixed junk (e.g., `INR 1,23,000/-`).
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
- `toINR` function to format numbers into Indian Rupee format (e.g., `\u20B91,10,00,000.00`).
- `toINRWords` function to convert numbers to words in Indian currency format.
- Paise support for decimal numbers (e.g., `Seventy-Five Paise`).
