#!/usr/bin/env node
/* eslint-env mocha */
'use strict';

const expect = require('chai').expect;
// const updateDbWithAllNationsProducts = require('../updateDbWithAllNationsProducts');
const mongo = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017/storeTest';
const productsAllNations = require('./AllNationsProducts.json');



describe('All Nations Products', function(){

  before('Clean db test', (done)=>{
    // Pupulate db.
    // Convert timestamp string to date.
    for (let val of productsAllNations){
      val.ts = new Date(val.ts);
    }
    // Connect to db.
    mongo.connect(mongoUrl, (err, db)=>{
      expect(err).to.equal(null);
      let col = db.collection('dealerProducts');
      // Drop table.
      col.drop(()=>{
        // Assert table was dropped.
        col.find().toArray((err, r)=>{
          expect(r.length).to.equal(0);
          // Insert All Nations products.
          col.insertMany(productsAllNations, (err, r)=>{
            expect(err).to.equal(null);
            expect(r.insertedCount).to.equal(productsAllNations.length);
          });
          // db.collection('dealerProducts')
          done();
        });
      });
    });
  });

  it('returns the biggest number from arguments', function(){
    var max = Math.max(1 ,2 ,10, 3);
    expect(max).to.equal(10);
  });
});
