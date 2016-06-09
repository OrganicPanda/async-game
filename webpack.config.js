'use strict';

let path = require('path')
  , webpack = require('webpack')
  , pkg = require('./package.json')
  , ExtractTextPlugin = require('extract-text-webpack-plugin')
  , HtmlWebpackPlugin = require('html-webpack-plugin');

let paths = {
  build: path.join(__dirname, 'build'),
  src: path.join(__dirname, 'src')
}
let devtool = '#inline-source-map';
let appEntries = [];
let baseAppEntries = [
  path.join(paths.src, 'app')
];

let devAppEntries = [
  'webpack-dev-server/client?http://localhost:8080/',
  'webpack/hot/only-dev-server'
];

let plugins = [];
let basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[hash].js'),
  new HtmlWebpackPlugin({
    template: path.join(paths.src, 'index.html'),
    inject: 'body'
  }),
  new ExtractTextPlugin('[name].[hash].css')
];

let devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
];

let prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    compress: {
      warnings: false
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins = basePlugins.concat(prodPlugins);
  appEntries = baseAppEntries.concat([]);
  devtool = '#source-map';
} else { // dev or rest
  plugins = basePlugins.concat(devPlugins);
  appEntries = baseAppEntries.concat(devAppEntries);
}

module.exports = {
  entry: {
    app: appEntries,
    vendor: [
      'es6-shim',
      'es6-promise',
      'pixi.js',
    ],
    style: path.join(paths.src, 'app.scss'),
  },
  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js'
  },
  devtool: devtool,
  resolve: {
    extensions: ['', '.js', '.html', '.scss', '.png', '.jpg'],
    moduleDirectories: [
      'node_modules'
    ]
  },
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: [
          'transform-decorators-legacy',
          'transform-object-rest-spread'
        ]
      },
      include: path.resolve('src'),
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg|svg)$/,
      loader: 'file?name=img/[name].[hash].[ext]'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(['css', 'autoprefixer', 'sass'])
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /(ionicons|roboto|noto).*?\.(svg|ttf|woff|eot)/,
      loader: 'file?name=fonts/[name].[hash].[ext]'
    }],
    postLoaders: [{
      include: path.resolve(__dirname, 'node_modules/pixi.js'),
      loader: 'transform?brfs'
    }]
  },
  sassLoader: {
    includePaths: [
      // ionic-framework uses `@import 'ionicons-icons'` wanting this dir
      // path.resolve(__dirname, './node_modules/ionicons/dist/scss'),

      // But we will use the standard `@import '~lib/dir/file'` syntax
      path.resolve(__dirname, './node_modules')
    ]
  }
};