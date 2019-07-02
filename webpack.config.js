const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: './src',
  },
  module: {
    rules: [
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true,
  })]
}
