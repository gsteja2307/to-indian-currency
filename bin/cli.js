#!/usr/bin/env node
const { toINR, toINRWords, parse, parseWords, expandCompact, breakdown, addGST, splitGST, applyCharges } = require('../dist/to-indian-currency.cjs.js')

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      args[k] = v === undefined ? true : v
    } else {
      args._.push(a)
    }
  }
  return args
}

function print(obj, json) {
  if (json) {
    console.log(JSON.stringify(obj))
  } else if (typeof obj === 'object') {
    console.log(obj)
  } else {
    console.log(String(obj))
  }
}

function main() {
  const args = parseArgs(process.argv)
  const cmd = args._[0]
  const json = !!args.json
  switch (cmd) {
    case 'format': {
      const val = Number(args._[1])
      if (!Number.isFinite(val)) {
        console.error(`Error: '${args._[1] ?? ''}' is not a valid number. Please provide a numeric value.`)
        process.exit(1)
      }
      const compact = !!args.compact
      const decimals = args.decimals != null ? Number(args.decimals) : undefined
      if (decimals != null && (!Number.isInteger(decimals) || decimals < 0)) {
        console.error(`Error: --decimals must be a non-negative integer`)
        process.exit(1)
      }
      const styleArg = (args.compactStyle || args.style)
      const style = styleArg === 'long' ? 'long' : 'short'
      const res = toINR(val, { compact, compactMin: 1000, compactStyle: style, round: decimals != null, roundDigits: decimals ?? undefined })
      print(res, json)
      break
    }
    case 'parse': {
      const s = args._.slice(1).join(' ')
      const tolerant = !!args.tolerant
      const dd = args.defaultDecimals != null ? Number(args.defaultDecimals) : undefined
      print(parse(s, { tolerant, defaultDecimals: dd }), json)
      break
    }
    case 'words': {
      const s = args._.slice(1).join(' ')
      print(parseWords(s), json)
      break
    }
    case 'breakdown': {
      const val = Number(args._[1])
      if (!Number.isFinite(val)) {
        console.error(`Error: '${args._[1] ?? ''}' is not a valid number. Please provide a numeric value.`)
        process.exit(1)
      }
      print(breakdown(val, {}), json)
      break
    }
    case 'expand': {
      const s = args._.slice(1).join(' ')
      print(expandCompact(s), json)
      break
    }
    case 'gst': {
      const sub = args._[1]
      const rate = Number(args.rate || args.r)
      const precision = args.precision != null ? Number(args.precision) : undefined
      const roundingMode = args.roundingMode
      if (sub === 'add') {
        const base = Number(args._[2])
        if (!Number.isFinite(base)) { console.error(`Error: base must be a valid number`); process.exit(1) }
        if (!Number.isFinite(rate)) { console.error(`Error: --rate must be a finite number`); process.exit(1) }
        print(addGST(base, rate, { precision, roundingMode }), json)
      } else if (sub === 'split') {
        const total = Number(args._[2])
        if (!Number.isFinite(total)) { console.error(`Error: total must be a valid number`); process.exit(1) }
        if (!Number.isFinite(rate)) { console.error(`Error: --rate must be a finite number`); process.exit(1) }
        print(splitGST(total, rate, { precision, roundingMode }), json)
      } else {
        console.error('gst subcommands: add|split --rate=18 [--precision=2] [--roundingMode=nearest|down|up|none]')
        process.exit(1)
      }
      break
    }
    case 'charges': {
      const base = Number(args._[1])
      if (!Number.isFinite(base)) { console.error(`Error: base must be a valid number`); process.exit(1) }
      const list = (args.list || '').split(',').filter(Boolean).map(pair => {
        const [name, rateStr] = pair.split(':')
        const rate = Number(rateStr)
        if (!Number.isFinite(rate)) {
          console.error(`Error: invalid rate for '${name}': '${rateStr}'. Rates must be finite numbers.`)
          process.exit(1)
        }
        return { name, rate }
      })
      const precision = args.precision != null ? Number(args.precision) : undefined
      const roundingMode = args.roundingMode
      print(applyCharges(base, list, { precision, roundingMode }), json)
      break
    }
    default: {
      console.log(`Usage:\n  to-indian-currency format <number> [--compact] [--decimals=N] [--json]\n  to-indian-currency parse <string> [--tolerant] [--defaultDecimals=N] [--json]\n  to-indian-currency words <string> [--json]\n  to-indian-currency breakdown <number> [--json]\n  to-indian-currency expand <string> [--json]\n  to-indian-currency gst add <base> --rate=18 [--precision=2] [--roundingMode=nearest|down|up|none] [--json]\n  to-indian-currency gst split <total> --rate=18 [--precision=2] [--roundingMode=nearest|down|up|none] [--json]\n  to-indian-currency charges <base> --list=GST:0.18,Cess:0.01 [--precision=2] [--roundingMode=nearest|down|up|none] [--json]`)
      process.exit(1)
    }
  }
}

main()
