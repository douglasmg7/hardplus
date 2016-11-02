#!/usr/bin/env node
'use strict';

// npm modules
// const path = require('path');
// const request = require('request');
const fs = require('fs');
const mongo = require('mongodb').MongoClient;

// personal modules
const log = require('./log');
const dbConfig = require('./dbConfig');

// Interval(min) to run the script.
const INTERVAL_RUN_MIN = 10;
// Signal to run the script to update store db.
const WATCH_FILE_NAME = '.db_change_all_nations.watch';
const WATCH_FILE = __dirname + '/' + WATCH_FILE_NAME;
// Timeout to cancel setInterval.
let timeout;

// Running directly from node.
if(require.main === module){
  // log.info(`Init: run interval: \u001b[44m${INTERVAL_RUN_MIN}min\u001b[40m, watch file: \u001b[44m${WATCH_FILE}\u001b[40m`);
  log.info('Init', {run_interval: `${INTERVAL_RUN_MIN}min`, watch_file: WATCH_FILE});
  // Run script for ther first time when started.
  runScript();
  // Create new interval to run script.
  timeout = setInterval(()=>{
    runScript();
  }, INTERVAL_RUN_MIN * 60000);
  // Watch file for changes in the All Nations products.
  fs.watchFile(WATCH_FILE, {interval: 2000}, (curr, prev)=>{
    if (curr.mtime !== prev.mtime) {
      log.info(`${WATCH_FILE_NAME} changed.`);
      // Cancel interval to run the script.
      clearInterval(timeout);
      // Run the script.
      runScript();
      // Create new interval to run script.
      timeout = setInterval(()=>{
        runScript();
      }, INTERVAL_RUN_MIN * 60000);
    }
  });
}

// Run the script
function runScript(){
  log.info('Running...');
  connectDb(dbConfig.url, (db=>{
    findProductsAllNations(db, products=>{
      insertProductsStore(db, products, ()=>{
        db.close();
        log.info('Db closed.');
        log.info('Slepping...');
      });
    });
  }));
}

// Connect to db.
function connectDb(url, callback){
  mongo.connect(url, (err, db)=>{
    if(err){
      log.error(`MongoDb connection, err: ${err}`);
      throw err;
    }
    log.info('Db opened.');
    callback(db);
  });
}

// Get all products that idStore is not empty.
// When the idStore is not empty, product was selected to be commercialize.
function findProductsAllNations(db, callback){
  log.info('Finding... All Nations products.');
  db.collection(dbConfig.collAllNationProducts).find({idStore: {$exists: true, $ne: ""}}).toArray()
    .then(products=>{
      log.info(`Found ${products.length} to be commercialized.`);
      log.silly(JSON.stringify(products, null, ' '));
      callback(products);
    })
    .catch(err=>{
      log.error(`Finding products All Nations, err: ${err}`);
      throw err;
    });
}

// Insert products.
function insertProductsStore(db, products, callback){
  if (products.length === 0) {
    callback(null, 'no-products');
    return;
  }
  log.info('Mounting bulk... to update All Nations products to be commercialized.');
  let bulk = db.collection(dbConfig.collStoreProducts).initializeUnorderedBulkOp();
  // Add each product to the bulk.
  for (let product of products) {
    bulk
      .find({dealerCode: product.code, dealer: "AllNations"})
      .upsert()
      .updateOne({
        dealer: "AllNations",
        dealerCode: product.code,
        dealerProductDesc: product.desc,
        idStore: product.idStore,
        price: product.price,
        stockLocation: product.stockLocation,
        active: (product.available && product.active),
        stockQtd: product.stockQtd
      });
  }
  log.info('Updating... All Nations products to be commercialized.');
  bulk.execute((err, r)=>{
    if(err){
      log.error(`Updating All Nations products to be commercialized, err: ${err}`);
    } else {
      log.info('Updated All Nations products to be commercialized.');
    }
    callback(r);
  });
}

// For unit test.
module.exports.connectDb = connectDb;
module.exports.findProductsAllNations = findProductsAllNations;
module.exports.insertProductsStore = insertProductsStore;