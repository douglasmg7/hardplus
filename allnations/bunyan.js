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

let timer = {
  start (label) {
    timer[label] = process.hrtime();
  },

  // n - nanoseconds
  // m - miliseconds
  // s - seconds
  stop (label, option) {
    if (this[label]) {
      // Elapsed time in nanoseconds.
      let elapsedTime = process.hrtime(this[label]);
      let elapsedTimeNs = elapsedTime[0] * 1e9 + elapsedTime[1];
      // unset this[label];
      switch (option) {
        case 'n':
          return elapsedTimeNs + 'ns';
        case 'm':
          return Math.round(elapsedTimeNs / 1e6) + 'ms';
        case 's':
          return Math.round(elapsedTimeNs / 1e9) + 's';
        default:
          return Math.round(elapsedTimeNs / 1e6) + 'ms';
      }
    }
    else {
      return (`${label} timer not started`);
    }
  }
};



let t = process.hrtime();
log.info(t);
// timer.start('t1');
setTimeout(()=>{
  // log.info('Timer t1: ' + timer.stop('t2'));
  let t_end = process.hrtime(t);
  let t_f = t_end[0] * 1e9 + t_end[1];
  log.info(Math.round(t_f / 1e6));
}, 2000);

log.error('Err logged');
log.warn('Warn logged');
log.info('Info logged');
log.debug('Debug logged');
log.trace('Trace logged');
