const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

require('@babel/register')({ extensions: ['.ts'], cache: false });

module.exports = function config(env, options) {
  const isEnvProduction = options.mode === 'production';
  const isEnvDevelopment = options.mode === 'development';
  const isDevServer = isEnvDevelopment && process.argv.includes('serve');
  const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');

  process.env.BABEL_ENV = options.mode;
  process.env.BROWSERSLIST_ENV = options.mode;

  const babelOptions = {
    rootMode: 'upward',
    plugins: [
      ['@babel/plugin-transform-runtime'],
      isDevServer && 'react-refresh/babel'
    ].filter(Boolean),
    cacheDirectory: '.cache/babel-loader',
    cacheCompression: false,
    compact: false, // isEnvProduction,
    sourceType: 'unambiguous'
  };

  const appConfig = {
    name: 'remote1',
    mode: isEnvProduction ? 'production' : 'development',
    target: isDevServer ? 'web' : 'browserslist',
    bail: isEnvProduction,

    entry: './src/index',

    output: {
      path: path.resolve(__dirname, 'build'),
      pathinfo: isEnvDevelopment,
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].js',
      publicPath: 'auto',
      uniqueName: 'remote1'
    },

    devtool: isEnvProduction ? 'source-map' : 'cheap-module-source-map',

    performance: {
      maxAssetSize: 650 * 1024,
      maxEntrypointSize: 650 * 1024
    },

    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.ts', '.d.ts', '.tsx', '.json']
    },

    module: {
      rules: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          include: [path.resolve(__dirname), path.resolve(__dirname, '../shared')],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.ts(x?)$/,
          include: [path.resolve(__dirname), path.resolve(__dirname, '../shared')],
          use: [
            {
              loader: 'babel-loader',
              options: babelOptions
            },
            {
              loader: 'ts-loader'
            }
          ]
        },
        {
          test: /\.(js|mjs)$/,
          include: [path.resolve(__dirname), path.resolve(__dirname, '../shared')],
          loader: 'babel-loader',
          options: babelOptions
        },
        {
          test: /\.((sc|c)ss)$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, 'public/index.html'),
        chunks: ['main'],
        ...(isEnvProduction && {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        })
      }),
      isEnvProduction &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      !isDevServer &&
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './public',
              filter: (filename) =>
                filename !== path.resolve(__dirname, 'public/index.html')
            }
          ]
        }),
      isDevServer && new webpack.HotModuleReplacementPlugin(),
      isDevServer && new ReactRefreshWebpackPlugin(),
      new ModuleFederationPlugin({
        name: 'remote1',
        library: { type: 'var', name: 'remote1' },
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App'
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          recoil: { singleton: true },
          shared: {
            import: '../shared/src/index',
            requiredVersion: require('../shared/package.json').version,
            singleton: true
          }
        }
      })
    ].filter(Boolean)
  };

  const devServer = {
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    historyApiFallback: { disableDotRule: true },
    port: 4001,
    hot: true
  };

  return isDevServer ? { ...appConfig, devServer } : [appConfig];
};
