/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

// Help Editor suggest values for the line of config code just below it
/** @type {(env: any, arg: {mode: string}) => import('webpack').Configuration} **/
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const isAnalyze = Boolean(env?.analyze)
  /** @type {import('webpack').Configuration} **/
  const config = {
    resolve: {
      // Resolve files in order of precedence from left to right if import
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    // The input file for webpack, this file is usually the file that imports all other files
    entry: ['./src/index.tsx'],
    // Declare the modules used in webpack
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader'] // Help translate TS, React code to JS,
        },
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader', // use import 'filename.css' in file tsx, ts
              options: { sourceMap: !isProduction } // Display sourcemap in dev environment for easy debugging
            },
            {
              loader: 'sass-loader', // compile sass to css
              options: { sourceMap: !isProduction }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/, // Used to import image files, if you have videos/photos in other formats, add them here
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/media/[name].[contenthash:6].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/, // Used to import font
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/fonts/[name].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    },

    output: {
      filename: 'static/js/main.[contenthash:6].js', // Add file name hash based on content to avoid being cached by CDN or browser.
      path: path.resolve(__dirname, 'dist'), // Build to dist folder
      publicPath: '/'
    },
    devServer: {
      hot: true, // enable Hot Module Replacement
      port: 3000,
      historyApiFallback: true, // Must set to true otherwise when you lazyload React module, you will get an error that the file could not be loaded.
      // Configure serving html files in public
      static: {
        directory: path.resolve(__dirname, 'public', 'index.html'),
        serveIndex: true,
        watch: true // when changing content in index.html it will also reload
      }
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      // Output css into a separate .css file instead of .js
      new MiniCssExtractPlugin({
        filename: isProduction ? 'static/css/[name].[contenthash:6].css' : '[name].css'
      }),
      // Use the env environment variable in the project
      new Dotenv(),
      // Copy all files in public folder except index.html
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            filter: (name) => {
              return !name.endsWith('index.html')
            }
          }
        ]
      }),

      // The plugin supports adding style and script tags to index.html
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        filename: 'index.html'
      }),
      // Add eslint for webpack
      new ESLintPlugin({
        extensions: ['.tsx', '.ts', '.js', '.jsx']
      })
    ]
  }

  //🚀 If build, will add some config
  if (isProduction) {
    config.plugins = [
      ...config.plugins,
      new webpack.ProgressPlugin(), // Show % when building
      // Compress brotli css and js
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress'
      }),
      new CleanWebpackPlugin() // Clean up previous build folder to prepare for current build
    ]
    if (isAnalyze) {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
    }
    config.optimization = {
      minimizer: [
        `...`,
        new CssMinimizerPlugin() // minify css
      ]
    }
  }
  return config
}
