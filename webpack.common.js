const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: ['./js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.min.[hash:8].js',
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader', {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('autoprefixer')],
            },
          },
        }],
    }],
  },
  target: 'web',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets/', to: 'assets/' },
      ],
    }),
    new HtmlPlugin({
      file: path.join(__dirname, 'dist', 'index.html'),
      template: './index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
}
