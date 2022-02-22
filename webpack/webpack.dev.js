const path = require('path');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
  module: {
    rules: [
      // 解决使用css modules时antd样式不生效
      {
        test: /.(less|css)$/,
        // 排除业务模块，其他模块都不采用css modules方式解析
        exclude: [/src/],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /.(less|css)$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'style-loader' },
          // {
          //   loader: 'css-loader',
          //   options: {
          //     modules: true,
          //   }
          // },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ],
        sideEffects: true, // package 中 sideEffects 设置为 false 后 所有文件都会被 Tree Shaking 通过 import 引入的 css 会被当作无用代码 这里 true 告诉 webpack 不要 shaking 掉
      },
    ]
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, '../dist'),
    port: 3004,
    open: true,
    compress: true,
    hot: true,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
  }
});
