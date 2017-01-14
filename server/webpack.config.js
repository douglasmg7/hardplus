'use strict';

let path = require('path');
let webpack = require('webpack');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
// const PRODUCTION = process.env.NODE_ENV === 'production';

let entry = DEVELOPMENT
  ? {
    bundleProductsAllNations: ['./public/js/productsAllNations.js', 'webpack-hot-middleware/client'],
    bundleProductsStore: ['./public/js/productsStore.js', 'webpack-hot-middleware/client'],
    bundleTt: ['./public/js/tt.js', 'webpack-hot-middleware/client']
  }
  : {
    bundleProductsAllNations: './public/js/productsAllNations.js',
    bundleProductsStore: './public/js/productsStore.js',
    bundleTt: './public/js/tt.js'
  };

let plugins = DEVELOPMENT
  ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
  : [];

module.exports = {
  cache: true,
  // devtool: 'source-map',   // for production
  // devtool: '#eval-source-map',
  devtool: 'eval',   // fast build
  entry: entry,
  // entry: {
  //   bundleProductsAllNations: './public/js/productsAllNations.js',
  //   bundleProductsStore: './public/js/productsStore.js',
  //   bundleTt: './public/js/tt.js'
  // },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },

  // uncomment to use standalone build instead run-time only
  // standalone required to use template instead of render
  // single componente can use template with run-time
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },

  module: {
    loaders: [
      // {
      //   test:/\.js$/,
      //   include: [
      //     path.resolve(__dirname, 'public/js')
      //     // path.resolve(__dirname, "app/test")
      //   ],
      //   // exclude: /(node_modules|bower_components)/,
      //   loader: 'babel',
      //   query: {
      //     cacheDirectory: true, //important for performance
      //     presets: ['es2015']
      //   }
      // }
      // {
      //   test:/\.jpg$/,
      //   // include: path.resolve(__dirname, 'srcd'),
      //   exclude: /(node_modules|bower_components)/,
      //   loader: 'file'
      //   // query: {
      //   //   name: '[name][hash].[ext]'
      //   // }
      // },
      // {
      //   test:/\.css$/,
      //   // include: path.resolve(__dirname, 'srcd'),
      //   exclude: /(node_modules|bower_components)/,
      //   loader: 'style!css'
      // }
    ]
  },
  plugins: plugins
};
