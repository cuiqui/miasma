const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const cssPluginConfig = {
  filename: "assets/css/[name].css",
};
const htmlPluginConfig = {
  title: 'Miasma',
  filename: 'index.html',
  template: 'templates/index.html',
  meta: {
    viewport: 'width=device-width, initial-scale=1',
  },
};

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'assets/js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new MiniCssExtractPlugin(cssPluginConfig),
    new HtmlWebpackPlugin(htmlPluginConfig),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};