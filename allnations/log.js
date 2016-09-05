#!/usr/bin/env node
'use strict';

const path = require('path');
const bunyan = require('bunyan');
const appName = path.basename(__filename);

let log = bunyan.createLogger({
  name: appName,
  streams: [
    {
      level: 'trace',
      stream: process.stdout
    },
    {
      level: 'info',
      path: __filename + '.log'
    }
  ],
  // src: true
});

let log = function init({pathName, }){
  return {
    bunyan.createLogger({
      name: appName,
      streams: [
        {
          level: 'trace',
          stream: process.stdout
        },
        {
          level: 'trace',
          path: __filename + '.log'
        }
      ],
      // src: true
    });
  }
};
module.exports = log;
