const fs = require('fs')
const pack = require('../package.json')

// update installation.md
const installation = fs
  .readFileSync('./gitbook/installation.md', 'utf-8')
  .replace(
    /https:\/\/unpkg\.com\/cryptowallet-js@[\d.]+.[\d]+\/dist\/cryptowallet-js\.js/,
    'https://unpkg.com/cryptowallet-js@' + pack.version + '/dist/cryptowallet-js.js.'
  )
fs.writeFileSync('./gitbook/installation.md', installation)
