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
const dbConfig = require('./dbConfig');

// Interval(min) to run the script.
const INTERVAL_RUN_MIN = 1;
// Signal to run the script to update store db.
const WATCH_FILE_NAME = '.dbChangeAllNations';
const WATCH_FILE = __dirname + '/' + WATCH_FILE_NAME;

// Keep timer value.
// let timerAux;

// Run directly from node.
if(require.main === module){
  log.info(`Start -> run interval: \u001b[44m${INTERVAL_RUN_MIN}min\u001b[40m, watch file: \u001b[44m${WATCH_FILE}\u001b[40m`);
  // Run script.
  setInterval(()=>{
    log.info('Run...');

  }, INTERVAL_RUN_MIN * 60000);

  connectDb(dbConfig.url, (db=>{
    findProductsAllNations(db, cursor=>{
      insertProductsStore(db, cursor, ()=>{
        db.close();
      });
    });
  }));
}

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

// Get all products that idStore is not empty.
// When the idStore is not empty, product was selected to be commercialize.
function findProductsAllNations(db, callback){
  db.collection(dbConfig.collAllNationProducts).find({idStore: {$ne: ""}}).toArray((err, products)=>{
    if(err){
      throw err;
    }
    callback(products);
  });
}

// Insert products.
function insertProductsStore(db, products, callback){
  let bulk = db.collection(dbConfig.collStoreProducts).initializeUnorderedBulkOp();
  // Add each product to the bulk.
  for (let product of products) {
    bulk
      .find({idStore: product.idStore, dealer: "AllNations", stockLocation: product.stockLocation})
      .upsert()
      .updateOne({
        idStore: product.idStore,
        dealer: "AllNations",
        dealerCode: product.code,
        price: product.price,
        stockLocation: product.stockLocation,
        active: (product.available && product.active),
        stockQtd: product.stockQtd
      });
  }
  // log.info('MongoDb insert.', {spend_time_mongodb_insert: timerAux});
  // log.debug('MongoDb insert.', {mongodb_insert: r.toJSON()});

  bulk.execute((err, r)=>{
    // log.debug('MongoDb insert.', {mongodb_insert: r.toJSON()});
    callback(err, r);
  });
}

// For unit test.
module.exports.connectDb = connectDb;
module.exports.findProductsAllNations = findProductsAllNations;
module.exports.insertProductsStore = insertProductsStore;
