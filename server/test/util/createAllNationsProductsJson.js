#!/usr/bin/env node

// Create a json file with All Nations porducts to be used in tests.
// Discard the _id field.

'use strict';

const fs = require('fs');
const assert = require('assert');
const mongo = require('mongodb').MongoClient;

const FILE_NAME = 'allNationsProducts.json';
// Database name.
const DB_NAME = 'store';
const MONGO_URL = `mongodb://localhost:27017/${DB_NAME}`;
// Collections name.
const COLL_ALL_NATION_PRODUCTS = 'dealerProducts';
// Amount of products to be created.
const PRODUCT_QTD  = 20;

// Discard _id field.
let replace = function(k, v){
  if(k === '_id'){
    return undefined;
  }
  return v;
};

// Connect to db.
mongo.connect(MONGO_URL, (err, db)=>{
  assert.equal(null, err);
  // Find All Nations products.
  db.collection(COLL_ALL_NATION_PRODUCTS).find().limit(PRODUCT_QTD).toArray((err, r)=>{
    assert.equal(null, err);
    db.close();
    // Write All Nations products to json file.
    fs.writeFile(FILE_NAME, JSON.stringify(r, replace, '  '), err=>{
      assert.equal(null, err);
      console.log(`All Nations products written to file: \u001b[44m${FILE_NAME}\u001b[40m`);
      console.log(`\u001b[42mYou shoud make manual changes to the created json file to perform desired test.\u001b[40m`);
      console.log(`\u001b[91mThe old file maybe alredy have the desired changes. Do not lost it!\u001b[39m`);
    });
  });
});
