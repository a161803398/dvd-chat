const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
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
    }, {
      test: /\.(ogg|mp3|wav|m4a|mpe?g)$/i,
      loader: 'file-loader',
      options: { name: 'sounds/[name].[contenthash:8].[ext]' },
    }],
  },
  target: 'web',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlPlugin({
      file: path.join(__dirname, 'dist', 'index.html'),
      template: './index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
}
