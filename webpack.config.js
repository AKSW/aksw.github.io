const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production', // development production
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/bibliography/aksw.json', to: 'aksw.json' },
      ],
    }),
  ],
  output: {
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i, // This now includes .css files
        use: [
          // https://webpack.js.org/plugins/mini-css-extract-plugin/
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};
