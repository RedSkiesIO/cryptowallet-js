const path = require('path');
module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  node: {
    Buffer: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cryptowallet-js.js',
    library: 'cryptowallet-js',
    libraryTarget: 'umd',
  },
  resolve: {
    alias: {
      lodash: path.resolve(__dirname, "node_modules/lodash"),
      'bn.js': path.resolve(__dirname, "node_modules/bn.js"),
    }
  }
};
