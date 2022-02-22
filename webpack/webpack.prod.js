const { merge } = require('webpack-merge');
const cssnano = require('cssnano');
const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base');

// const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
const manifestName = `manifest-123.json`;

module.exports = merge(baseConfig, {
  mode: 'production',
  // devtool: 'none',
  cache: {
    type: 'filesystem',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      // analyzerMode: 'disabled', // 不启动展示 http 服务器
      // generateStatsFile: true // 生成描述文件
    }), // stat统计信息 
    // CSS Tree Shaking
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${paths.appSrc}/**/*`, { nodir: true }),
    // }),
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css'
    }),
    // new PurgecssWebpackPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    // }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    new StatsPlugin(
      manifestName,
      {
        chunkModules: false,
        source: true,
        chunks: false,
        modules: false,
        assets: true,
        children: false,
        exclude: [/node_modules/],
      },
    ),
    new HtmlWebpackPlugin({
      meta: {
        manifest: manifestName,
      },
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      // 解决使用css modules时antd样式不生效
      {
        test: /.(less|css)$/,
        // 排除业务模块，其他模块都不采用css modules方式解析
        exclude: [/src/],
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
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
  // optimization: {
  //   runtimeChunk: true, // 为运行时代码创建一个额外的chunk 减小 entry chunk 的体积
  //   minimize: true, // 开启最小化
  //   minimizer: [ // 最小化 压缩
  //     new TerserPlugin(),
  //     new CssMinimizerPlugin()
  //   ],
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 0,
  //     // cacheGroups: {
  //     //   commons: {
  //     //     name: 'vendors',
  //     //     chunks: 'all',
  //     //     minChunks: 2,
  //     //   },
  //     // }
  //     cacheGroups: {
  //       vendors: { // node_modules里的代码
  //         test: /[\\/]node_modules[\\/]/,
  //         chunks: "all",
  //         // name: 'vendors',
  //         priority: 10, // 优先级
  //         enforce: true
  //       }
  //     }
  //   }
  // }
});
