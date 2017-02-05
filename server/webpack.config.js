'use strict';

let path = require('path');
let webpack = require('webpack');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
// const PRODUCTION = process.env.NODE_ENV === 'production';

let entry = DEVELOPMENT
  ? {
    // bundleProductsAllNations: ['./src/js/productsAllNations.js', 'webpack-hot-middleware/client'],
    // bundleProductsStore: ['./src/js/productsStore.js', 'webpack-hot-middleware/client'],
    bundleTt: ['./src/js/tt.js', 'webpack-hot-middleware/client?reload=true'],
    bundleMain: ['./src/js/v.js', 'webpack-hot-middleware/client'],
    bundleJ: ['./src/js/j.js', 'webpack-hot-middleware/client?reload=true'],
    bundleS: ['./src/js/s.js', 'webpack-hot-middleware/client?reload=true'],
    bundlePStore: ['./src/js/pStore.js', 'webpack-hot-middleware/client?reload=true'],
    bundle_productsAllNations: ['./src/js/_productsAllNations.js', 'webpack-hot-middleware/client?reload=true']
  }
  : {
    bundleProductsAllNations: './src/js/productsAllNations.js',
    bundleProductsStore: './src/js/productsStore.js',
    bundleTt: './src/js/tt.js'
  };

let plugins = DEVELOPMENT
  ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
  : [];

module.exports = {
  // cache: true,
  // devtool: 'source-map',   // for production
  // devtool: '#eval-source-map',
  // devtool: 'eval',   // fast build
  devtool: '#eval-source-map',
  entry: entry,
  // entry: {
  //   bundleProductsAllNations: './public/js/productsAllNations.js',
  //   bundleProductsStore: './public/js/productsStore.js',
  //   bundleTt: './public/js/tt.js'
  // },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '',
    // publicPath: 'dist/',
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
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(eot|png|svg|[ot]tf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {limit: 10000}
      },
      // {
      //   test:/.eot$/,
      //   loader:'url-loader',
      //   query:{mimetype:'application/vnd.ms-fontobject',name:'./public/css/semantic/themes/default/assets/fonts/icons.eot'}
      // },
      // {
      //   test:/.woff$/,
      //   loader:'url-loader',
      //   query:{mimetype:'application/font-woff',name:'./public/css/semantic/themes/default/assets/fonts/icons.woff'}
      // },
      // {
      //   test:/.woff2$/,
      //   loader:'url-loader',
      //   query:{mimetype:'application/font-woff2',name:'./public/css/semantic/themes/default/assets/fonts/icons.woff2'}
      // },
      // {
      //   test:/.[ot]tf$/,
      //   loader:'url-loader',
      //   query:{mimetype:'application/octet-stream',name:'./public/css/semantic/themes/default/assets/fonts/icons.ttf'}
      // },
      // {
      //   test:/.svg$/,
      //   loader:'url-loader',
      //   query:{mimetype:'image/svg+xml',name:'./public/css/semantic/themes/default/assets/fonts/icons.svg'}
      // },
      {
        test: /\.(jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // }
    ]
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  plugins: plugins
};
