const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production', // development production
  plugins: [new MiniCssExtractPlugin()],
  output: {
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
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
