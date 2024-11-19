
# to-indian-currency
[![NPM version](https://img.shields.io/npm/v/to-indian-currency.svg)](https://www.npmjs.com/package/to-indian-currency)
[![NPM downloads](https://img.shields.io/npm/dm/to-indian-currency.svg)](https://www.npmjs.com/package/to-indian-currency)
[![GitHub stars](https://img.shields.io/github/stars/gsteja2307/to-indian-currency.svg)](https://github.com/gsteja2307/to-indian-currency/stargazers)

A simple utility to convert numbers into Indian Rupee format and words.

## Features
- Converts numbers into Indian Rupee format (`₹10,00,000.00`)
- Converts numbers to words in Indian currency format (`Two Lakh Five Thousand Thirty Rupees`)
- Handles paise for decimal numbers (`Seventy-Five Paise`)

## Installation

```bash
npm install to-indian-currency
```

## Usage

### Import and use the library

```javascript
const { toINR, toINRWords } = require('to-indian-currency')

// Convert number to Indian Rupee format
console.log(toINR(1000000))           // Output: "₹10,00,000.00"

// Convert number to Indian currency in words
console.log(toINRWords(205030.75))     // Output: "Two Lakh Five Thousand Thirty Rupees and Seventy-Five Paise"
```

## API

### `toINR(amount: number): string`
Formats a number into the Indian Rupee currency format.

### `toINRWords(amount: number): string`
Converts a number to a human-readable format in Indian currency (in words).

## License

MIT
