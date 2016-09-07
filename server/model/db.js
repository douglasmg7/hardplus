'use strict';

const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/store';

// let db = 2;
let state = {db: null};

console.log('db.js load');

mongo.connect(mongoUrl, (err, database)=>{
  if(err){
    console.log('MongoDb connection error.', {err: err});
    process.exit(1);
  } else {
    // db = database;
    console.log('db.js: ' + state.db);
    state.db = database;
    console.log('Connected to mongoDb.');
    console.log('db.js: ' + state.db);
  }
});

// exports.db = state;
module.exports = state;
