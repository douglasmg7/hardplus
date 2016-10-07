'use strict';

const mongo = require('mongodb').MongoClient;
const dbConfig = require('../bin/dbConfig');

let state = {
  db: null,
  config: dbConfig
};

mongo.connect(dbConfig.url, (err, database)=>{
  if(err){
    console.log('MongoDb connection error.', {err: err});
    process.exit(1);
  } else {
    state.db = database;
    console.log('Connected to mongoDb.');
  }
});

module.exports = state;
