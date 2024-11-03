const { toINR, toINRWords } = require('./dist/to-indian-currency.umd.js')

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