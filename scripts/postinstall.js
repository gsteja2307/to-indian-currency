/* eslint-disable no-console */
try {
  const path = require('path')
  const fs = require('fs')
  const pkgPath = path.join(__dirname, '..', 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const name = pkg.name || 'to-indian-currency'
  const version = pkg.version || ''
  const author = 'G Surya Teja'
  const repo = (pkg.repository && pkg.repository.url) ? pkg.repository.url : ''
  const line = '─'.repeat(50)
  if (!(process.env.CI || process.env.NO_INSTALL_BANNER === '1')) {
    console.log(`\n${line}`)
    console.log(`${name} v${version}`)
    console.log(`Author: ${author}`)
    if (repo) console.log(`Repo:   ${repo}`)
    console.log('Third-party licenses: dist/THIRD_PARTY_LICENSES.txt')
    console.log('Set NO_INSTALL_BANNER=1 to hide this message.')
    console.log(`${line}\n`)
  }
} catch (_) {
  // best-effort only; never fail install
}
