#!/usr/bin/env node
'use strict';

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

// npm modules
const path = require('path');
const winston = require('winston');
// file to log.
let parsePath = path.parse(module.parent.filename);
const logPath = parsePath.dir + '/' + parsePath.name + '.log';
// console.log(logPath);

// Log configuration.
let log = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      level: 'silly',
      prettyPrint: true,
      silent: false,
      colorize: true,
      timestamp: true,
      filename: logPath,
      maxsize: 40000,
      maxFiles: 10,
      json: false
      // pid: 2323
    })
  ]
});

// No test mode.
if(process.env.NODE_ENV !== 'test'){
  log.add(winston.transports.Console,
    {
      level: 'info',
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: false
    }
  );
}

module.exports = module = log;
