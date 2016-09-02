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

log.error('Err logged');
log.warn('Warn logged');
log.info('Info logged');
log.debug('Debug logged');
log.trace('Trace logged');
