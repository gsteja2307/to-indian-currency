import { defineConfig } from 'vite'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'
import license from 'rollup-plugin-license'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// read package info for banner
const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'))
const AUTHOR_NAME = 'G Surya Teja'

export default defineConfig({
    esbuild: {
        legalComments: 'none'
    },
    plugins: [
        // Balanced obfuscation to keep size reasonable
        javascriptObfuscator({
            compact: true,
            identifierNamesGenerator: 'hexadecimal',
            simplify: true,
            // Keep heavy transforms off to reduce size
            controlFlowFlattening: false,
            deadCodeInjection: false,
            stringArray: false,
            selfDefending: false,
            numbersToExpressions: false,
            renameGlobals: false,
            transformObjectKeys: false,
            unicodeEscapeSequence: false
        }),
        // Add a tiny banner with package info and pointer to 3P licenses
        license({
            thirdParty: {
                output: 'dist/THIRD_PARTY_LICENSES.txt'
            },
            banner: {
                commentStyle: 'regular',
                content: `to-indian-currency v${pkg.version} | ${pkg.repository?.url || ''}\nAuthor: ${AUTHOR_NAME}\nThird-party licenses: dist/THIRD_PARTY_LICENSES.txt`
            }
        }),
        {
            name: 'prepend-banner',
            generateBundle(_, bundle) {
                const banner = `/*! to-indian-currency v${pkg.version} | Author: ${AUTHOR_NAME} | ${pkg.repository?.url || ''} | Third-party licenses: dist/THIRD_PARTY_LICENSES.txt */\n`
                for (const file of Object.keys(bundle)) {
                    if (file.endsWith('.js')) {
                        const chunk = bundle[file]
                        if (chunk && 'code' in chunk) {
                            chunk.code = banner + chunk.code
                        }
                    }
                }
            }
        }
    ],
    build: {
        minify: 'esbuild',
        sourcemap: false,
        lib: {
            entry: './src/index.ts',
            name: 'ToIndianCurrency',
            fileName: (format) => `to-indian-currency.${format}.js`,
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            output: {
                banner: `/*! to-indian-currency v${pkg.version} | Author: ${AUTHOR_NAME} | ${pkg.repository?.url || ''} | Third-party licenses: dist/THIRD_PARTY_LICENSES.txt */`,
                globals: {
                    'number-to-words': 'toWords'
                }
            }
        }
	}
})
