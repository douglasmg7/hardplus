#!/usr/bin/env node
'use strict';

// npm modules
// const path = require('path');
// const fs = require('fs');
// const request = require('request');
const mongo = require('mongodb').MongoClient;

// personal modules
// const timer = require('./timer');
const log = require('./log');

// Interval(min) to run the script.
const INTERVAL_RUN_MIN = 1;
// Signal to run the script to update store db.
const WATCH_FILE_NAME = '.dbChangeAllNations';
const WATCH_FILE = __dirname + '/' + WATCH_FILE_NAME;
// Mongodb Db.
const mongoUrl = 'mongodb://localhost:27017/store';

// Keep timer value.
// let timerAux;


log.info(`Start -> run interval: \u001b[44m${INTERVAL_RUN_MIN}min\u001b[40m, watch file: \u001b[44m${WATCH_FILE}\u001b[40m`);

// Run script.
setInterval(()=>{
  log.info('Run...');

}, INTERVAL_RUN_MIN * 60000);

connectDb(mongoUrl, (db=>{
  findProductsAllNations(db, cursor=>{
    insertProductsStore(db, cursor, ()=>{
      db.close();
    });
  });
}));

// Connect to db.
function connectDb(url, callback){
  mongo.connect(url, (err, db)=>{
    if(err){
      log.err(`MongoDb connection, err: ${err}`);
      return;
    }
    callback(db);
  });
}

// Get all products that idStore field exist.
function findProductsAllNations(db, callback){
  let cursor = db.collection('dealerProducts').find({idStore: {$ne: ""}});
  callback(cursor);
}

// Insert products.
function insertProductsStore(db, product, callback){
  let bulk = db.collection('products').initializeUnorderedBulkOp();
  product.each((err, doc)=>{
    if (doc != null) {
      bulk
        .find({idStore: doc.idStore, dealer: "AllNations", stockLocation: doc.stockLocation})
        .upsert()
        .updateOne({
          idStore: doc.idStore,
          dealer: "AllNations",
          price: doc.price,
          stockLocation: doc.stockLocation,
          active: (doc.available && doc.active),
          stockQtd: doc.stockQtd
        });
    }
    else {
      bulk.execute((err, r)=>{
        if(err){
          log.err('Error inserting products on mongoDb', {err: err});
        }
        callback(r);
      });
    }
  });
}
