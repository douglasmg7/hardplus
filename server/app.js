/* eslint no-unused-vars: 0 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('./model/db');
// webpack HMR - hot module reload
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require('./webpack.config');
// personal modules
const log = require('./bin/log');

// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var routeWsAllNations = require('./routes/wsAllNations');
var routeWsProducts = require('./routes/wsProducts');
var routeProducts = require('./routes/products');

var app = express();

// webpack HMR
var compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  // noInfo: false, publicPath: './asdf', stats: {colors: true}
  noInfo: false, publicPath: webpackConfig.output.publicPath, stats: {colors: true}
}));
console.log(webpackConfig.output);
app.use(webpackHotMiddleware(compiler));

// pretty in development
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Not log request in test mode.
if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/users', users);
// web service
app.use('/ws/allnations', routeWsAllNations);
app.use('/ws/products', routeWsProducts);
// html
app.use('/products', routeProducts);

// test
app.get('/tt', (req, res)=>{
  res.render('tt');
});

app.use(function(err, req, res, next) {
  res.status(500).send({error: 'Internal server error.'});
  // res.json(500, {ERROR: 'Internal server error.'} );
  log.error(err.stack);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
