import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: './src/index.js',
			name: 'ToIndianCurrency',
			fileName: (format) => `to-indian-currency.${format}.js`
		},
		rollupOptions: {
			output: {
				globals: {
					'number-to-words': 'toWords'
				}
			}
		}
	}
})
