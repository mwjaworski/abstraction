module.exports = {
  entry: `./lib/index.ts`,
  devtool: `source-map`,
  output: {
    filename: `build/compute.js`,
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: `ts-loader`,
        exclude: /node_modules/,
      },
      {
        enforce: `pre`,
        test: /\.tsx?$/,
        use: `source-map-loader`
      }
    ]
  },
  externals: {        
    lodash : {
      commonjs: `lodash`,
      amd: `lodash`,
      root: `_`
    }
  },
  resolve: {
    extensions: [`.tsx`, `.ts`, `.js`]
  }
};