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
const SocialTags = require('social-tags-webpack-plugin')
const OpenBrowserPlugin = require('opn-browser-webpack-plugin')

module.exports = (env, argv) => {

  const pages = []

  fs.readdirSync('./src/pages/').forEach(file => {
    const page = file.split('.')[0]
    let filename = './'

    if (page !== 'index') {
      const pagePath = page.split('_')
      for (let i = 0; i < pagePath.length; i++) {
        filename += pagePath[i] + '/'
      }
    }

    filename += 'index.html'

    pages.push(new HtmlWebPackPlugin({
      template: './src/template.html',
      filename,
      templateParameters() { return { page } }
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
      new SocialTags({
        appUrl: 'https://userbase.com/',
        facebook: {
          'og:url': "https://userbase.com",
          'og:type': "website",
          'og:title': "Userbase",
          'og:image': './src/img/og_card.png',
          'og:description': "The easiest way to add user accounts & persistence to your static site.",
          'og:site_name': "Userbase",
          'og:locale': "en_US"
        },
        twitter: {
          "twitter:card": "summary_large_image",
          "twitter:site": "@UserbaseHQ",
          "twitter:creator": "@UserbaseHQ",
          "twitter:url": "https://userbase.com",
          "twitter:title": "Userbase",
          "twitter:description": "The easiest way to add user accounts & persistence to your static site.",
          "twitter:image": './src/img/og_card.png'
        },
      }),
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
      port: 3000
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
