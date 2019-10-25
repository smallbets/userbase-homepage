const fs = require('fs')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const OpenBrowserPlugin = require('opn-browser-webpack-plugin')

module.exports = (env, argv) => {

  const pages = []

  fs.readdirSync('./src/pages/').forEach(file => {
    const page = file.split('.')[0]

    pages.push(new HtmlWebPackPlugin({
      template: './src/template.html',
      filename: './' + file,
      templateParameters() { return { page: file.split('.')[0] } }
    }))
  })

  const config = {
    entry: {
      main: './src/index.js'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js',
      globalObject: 'this'
    },
    target: 'web',
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader',
          ]
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          use: ['source-map-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
          use: ['file-loader']
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: 'style.css',
        ignoreOrder: false
      }),
      ...pages,
      new FaviconsWebpackPlugin('./src/img/icon.png'),
      new HtmlBeautifyPlugin({
        config: {
          html: {
            end_with_newline: true,
            indent_size: 2,
            indent_with_tabs: false,
            indent_inner_html: false,
            preserve_newlines: true
          }
        }
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.WatchIgnorePlugin(['./dist'])
    ]
  }

  if (argv.mode == 'development') {
    config.devtool = 'inline-source-map'

    config.devServer = {
      watchContentBase: true,
      hot: true,
      inline: true,
      host: '0.0.0.0',
      port: 3000,
      historyApiFallback: {
        rewrites: [
          {
            from: /^\/.*$/,
            to: function (context) {
              return '/' + context.parsedUrl.pathname + '.html';
            }
          }
        ]
      }
    }

    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.plugins.push(new OpenBrowserPlugin({
      url: 'http://localhost:3000'
    }))
  }

  if (argv.mode == 'production') {
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  }

  return config
}
