#!/usr/bin/env node
'use strict';

var winston = require('winston');
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'silly',
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: false
    }),
    new (winston.transports.File)({
      level: 'silly',
      prettyPrint: false,
      silent: false,
      colorize: true,
      timestamp: true,
      filename: 'nKindler.log',
      maxsize: 40000,
      maxFiles: 10,
      json: false
      // pid: 2323
    })
  ]
});

log.silly('silly log');
log.debug('debug log');
log.verbose('verbose log');
log.info('info log');
log.warn('warn log.');
log.error('error log');
