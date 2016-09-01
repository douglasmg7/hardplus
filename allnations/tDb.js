#!/usr/bin/env node
// maybe lost some data if the two server have diferent time

'use strict';

const path = require('path');
const fs = require('fs');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;
// Mongodb configuration
const mongoUrl = 'mongodb://localhost:27017/test';

console.log('script started');

mongo.connect(mongoUrl, (err, db)=>{
	assert.equal(null, err);

  let products = [];
  let t = `board'`;
  // products.push({code: 1, name: 'board', loja: 'sp', price: 111});
  // products.push({code: 2, name: 'mouse', loja: 'sp', price: 222});
  // products.push({_id: 3, name: 'memory', price: 44});

  let bulk = db.collection('produtct').initializeUnorderedBulkOp();
  bulk.find({code: '1', loja: 'sp'}).upsert().updateOne({code: '1', loja: 'sp', name: t, price: '111'});
  bulk.find({code: '2', loja: 'rj'}).upsert().update({$set: {code: '2', loja: 'ma', price: '223'}});
  bulk.find({code: '3', loja: 'sp'}).upsert().updateOne({code: '3', loja: 'sp', name: 'memory', price: '333'});
  bulk.execute((err, r)=>{
    assert.equal(null, err);
    // console.log(r);
    console.log(r.toJSON());
    // console.log(r.nInserted);
    // console.log(r.nInserted);
    db.close();
  });

	// // db.collection('produtct').insertMany(products, (err, r)=>{
	// db.collection('produtct').updateMany({code: 1, loja: 'rj'}, {$set: {name: 'board', price: 3}}, {upsert: true}, (err, r)=>{
	// 	assert.equal(null, err);
  //   console.log(`insert count: ${r.insertedCount}`);
	// 	console.log(r);
	// 	db.close();
	// });
});
