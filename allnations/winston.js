#!/usr/bin/env node
'use strict';

// const winston = require('winston');
//
// winston.add(
//   winston.transports.File, {
//     filename: 'file.log',
//     level: 'info',
//     json:false,
//     timestamp: true,
//     pid: 2323
//   }
// );
// winston.level = 'debug';
// winston.info('App started');
// winston.debug('debug', 'Hummm.');
// winston.warn('debug', 'Hummm.');


var winston = require('winston');
// var logger = new (winston.Logger)({
//   levels: {
//     trace: 0,
//     input: 1,
//     verbose: 2,
//     prompt: 3,
//     debug: 4,
//     info: 5,
//     data: 6,
//     help: 7,
//     warn: 8,
//     error: 9
//   },
//   colors: {
//     trace: 'magenta',
//     input: 'grey',
//     verbose: 'cyan',
//     prompt: 'grey',
//     debug: 'blue',
//     info: 'green',
//     data: 'grey',
//     help: 'cyan',
//     warn: 'yellow',
//     error: 'red'
//   }
// });
//
// logger.add(winston.transports.Console, {
//   level: 'trace',
//   prettyPrint: true,
//   colorize: true,
//   silent: false,
//   timestamp: false
// });
//
// logger.add(winston.transports.File, {
//   prettyPrint: false,
//   level: 'info',
//   silent: false,
//   colorize: true,
//   timestamp: true,
//   filename: './nKindler.log',
//   maxsize: 40000,
//   maxFiles: 10,
//   json: false
// });

// winston.level = 'debug';
// logger.info('App started');
// logger.debug('debug', 'Hummm.');
// logger.warn('debug', 'Hummm.');
winston.info('App started');
winston.debug('debug', 'Hummm.');
winston.warn('debug', 'Hummm.');
