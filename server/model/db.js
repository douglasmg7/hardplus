'use strict';

const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/store';

let state = {db: null};

mongo.connect(mongoUrl, (err, database)=>{
  if(err){
    console.log('MongoDb connection error.', {err: err});
    process.exit(1);
  } else {
    state.db = database;
    console.log('Connected to mongoDb.');
  }
});

module.exports = state;
