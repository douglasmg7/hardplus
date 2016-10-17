'use strict';

const mongo = require('mongodb').MongoClient;
const dbConfig = require('../bin/dbConfig');
const log = require('../bin/log');

let state = {
  db: null,
  config: dbConfig
};

mongo.connect(dbConfig.url, (err, database)=>{
  if(err){
    log.error('MongoDb connection error.', {err: err});
    process.exit(1);
  } else {
    state.db = database;
    log.info('Connected to mongoDb.');
  }
});

module.exports = state;
