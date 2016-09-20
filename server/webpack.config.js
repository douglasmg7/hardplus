'use strict';

// let path = require('path');

module.exports = {
  debug: false,
  cache: true,
  // devtool: 'source-map',   // for production
  devtool: 'eval',   // fast build
  entry: {
    bundle: './public/js/allnations.js'
  },
  output: {
    path: './public/js/',
    filename: '[name].js'
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
  }
};