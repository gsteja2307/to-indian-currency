// Local example using built CJS bundle
const { toINR, toINRWords } = require('./dist/to-indian-currency.cjs.js')

// Test the toINR function
console.log(toINR(1000000))
console.log(toINR(5342421.50))
console.log(toINR(5342411212112313212321.50))

// Test the toINRWords function
console.log(toINRWords(15300))
console.log(toINRWords(205030.75))
console.log(toINRWords(2075033.11))
console.log(toINRWords(20175069.99))
console.log(toINRWords(201751030.99))
console.log(toINRWords(2011751030.99))

// Compact (no rounding; values are truncated)
console.log(toINR(1500, { compact: true }))      // ₹1.5K
console.log(toINR(1250, { compact: true }))      // ₹1.25K
console.log(toINR(12344, { compact: true }))     // ₹12.344K
console.log(toINR(150000, { compact: true }))    // ₹1.5L
console.log(toINR(32000000, { compact: true }))  // ₹3.2Cr
console.log(toINR(-150000, { compact: true }))   // -₹1.5L

// Compact notation examples
console.log(toINR(1500, { compact: true }))
console.log(toINR(150000, { compact: true }))
console.log(toINR(1512433, { compact: true, compactStyle: 'long' }))
console.log(toINR(32000000, { compact: true }))
