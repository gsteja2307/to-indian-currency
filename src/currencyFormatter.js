import { toWords } from 'number-to-words'

// Custom function to convert number to Indian currency words
function formatToIndianWords(number) {
	const units = [
		{ value: 10000000, name: 'Crore' },
		{ value: 100000, name: 'Lakh' },
		{ value: 1000, name: 'Thousand' },
		{ value: 100, name: 'Hundred' }
	]
	let words = ''
	let remainder = number

	for (let i = 0; i < units.length; i++) {
		const { value, name } = units[i]
		const quotient = Math.floor(remainder / value)
		if (quotient > 0) {
			words += `${toWords(quotient)} ${name} `
			remainder = remainder % value
		}
	}

	if (remainder > 0) {
		words += `${toWords(remainder)}`
	}

	return words.trim()
}

// Format number to Indian currency format (₹10,00,000.00)
export function toINR(amount) {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 2
	}).format(amount)
}

// Convert number to Indian currency in words (e.g., "Two Lakh Five Thousand Thirty Rupees")
export function toINRWords(amount) {
	const integerPart = Math.floor(amount)
	const decimalPart = Math.round((amount - integerPart) * 100)
	const rupeeWords = `${formatToIndianWords(integerPart)} Rupees`
	const paiseWords = decimalPart > 0 ? ` and ${toWords(decimalPart)} Paise` : ''
	return rupeeWords + paiseWords
}
