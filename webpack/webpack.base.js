const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const pkgJson = require('../package.json');

const cwd = process.cwd();

module.exports = {
  entry: {
    root: "./config/singleSpa.js",
    // layout: "./src/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: "/",
    library: pkgJson.systemName,
    libraryTarget: "umd"
  },
  devtool: 'source-map',
  // externals: ['react', 'react-dom', 'single-spa', 'moment', 'lodash'],
  module: {
    rules: [
      {
        test: /.(js|ts)x?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 逆序执行
              presets: [
                "@babel/preset-env",
                // 解析jsx语法
                [
                  "@babel/preset-react",
                  {
                    runtime: 'automatic', // 无需引入react
                  },
                ],
                // 解析ts语法
                "@babel/preset-typescript",
              ],
              "plugins": [
                [
                  "import", {
                    "libraryName": "antd",
                    "style": "css"
                  }
                ]
              ]
            },
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|TTF|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      '@assets': path.resolve(cwd, 'src/assets'),
      '@routes': path.resolve(cwd, 'src/routes'),
      '@components': path.resolve(cwd, 'src/component'),
      '@common': path.resolve(cwd, 'src/common'),
      '@hooks': path.resolve(cwd, 'src/hooks'),
      '@layout': path.resolve(cwd, 'src/layout'),
      '@pages': path.resolve(cwd, 'src/pages'),
      '@types': path.resolve(cwd, 'src/types'),
      '@utils': path.resolve(cwd, 'src/utils'),
    }
  },
  plugins: [
    new ProgressBarPlugin(),
    // new CleanWebpackPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new FriendlyErrorsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
  ],
  stats: 'errors-only'
}
