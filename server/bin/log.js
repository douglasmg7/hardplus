#!/usr/bin/env node
'use strict';

// npm modules
const path = require('path');
const winston = require('winston');

// console.log(path.parse(module.parent.filename).name + '.log');

// Log configuration.
let log = new (winston.Logger)({
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
      prettyPrint: true,
      silent: false,
      colorize: true,
      timestamp: true,
      filename: path.parse(module.parent.filename).name + '.log',
      maxsize: 40000,
      maxFiles: 10,
      json: false
      // pid: 2323
    })
  ]
});

module.exports = module = log;
