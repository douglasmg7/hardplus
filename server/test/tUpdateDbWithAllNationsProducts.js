#!/usr/bin/env node
/* eslint-env mocha */
'use strict';

const expect = require('chai').expect;
const AllNations = require('../bin/updateDbWithAllNationsProducts');
const mongo = require('mongodb').MongoClient;
const productsAllNations = require('./allNationsProducts.json');
const productsStore = require('./storeProducts.json');
// Database name.
const DB_NAME = 'storeTest';
const MONGO_URL = `mongodb://localhost:27017/${DB_NAME}`;

// Db connection used into the test.
let dbTest = null;
// All Nations products to be commercialized.
let productsANC = null;

// Initialize All Nations collections.
function initAllNationsCollection(db, callback){
  let col = db.collection(AllNations.COLL_ALL_NATION_PRODUCTS);
  // Drop table.
  col.drop(()=>{
    // Assert table was dropped.
    col.find().toArray((err, r)=>{
      expect(r.length).to.equal(0);
      // Insert All Nations products.
      col.insertMany(productsAllNations, (err, r)=>{
        expect(err).to.equal(null);
        expect(r.insertedCount).to.equal(productsAllNations.length);
        callback();
      });
    });
  });
}

// Initialize store collections.
function initStoreCollection(db, callback){
  let col = db.collection(AllNations.COLL_STORE_PRODUCTS);
  // Drop table.
  col.drop(()=>{
    // Assert table was dropped.
    col.find().toArray((err, r)=>{
      expect(r.length).to.equal(0);
      // Insert store products.
      col.insertMany(productsStore, (err, r)=>{
        expect(err).to.equal(null);
        expect(r.insertedCount).to.equal(productsStore.length);
        callback();
      });
    });
  });
}


describe('All Nations', function(){
  before('Clean db test', (done)=>{
    // Pupulate db.
    // Convert timestamp string to date.
    for (let val of productsAllNations){
      val.ts = new Date(val.ts);
    }
    // Connect to db.
    mongo.connect(MONGO_URL, (err, db)=>{
      expect(err).to.equal(null);
      initAllNationsCollection(db, ()=>{
        initStoreCollection(db,()=>{
          db.close();
          done();
        });
      });
    });
  });

  it('Connect to db products.', function(done){
    AllNations.connectDb(MONGO_URL, db=>{
      expect(db.databaseName).to.equal(DB_NAME);
      dbTest = db;
      done();
    });
  });

  it('Get products configured to be commercialized.', done=>{
    AllNations.findProductsAllNations(dbTest, products=>{
      expect(products).to.have.lengthOf(5);
      // Sort by idStore;
      products.sort((a, b)=>{
        return b.idStore < a.idStore ? 1: -1;
      });
      // idStore from db.
      let idStoreTest = [
        'flt-hrd-002',
        'flt-hrd-003',
        'mouse-hrd-001',
        'pen-drive-hrd-004',
        'tcl-hrd-005'
      ];
      for (let i = 0; i < products.length; i++) {
        expect(products[i].idStore).to.have.string(idStoreTest[i]);
      }
      // To be used into the next test.
      productsANC = products;
      done();
    });
  });

  it('Insert All Nations products into store database.', done=>{
    AllNations.insertProductsStore(dbTest, productsANC, ()=>{
      let col = dbTest.collection(AllNations.COLL_STORE_PRODUCTS);
      col.find().toArray((err, products)=>{
        expect(products).to.be.lengthOf(productsANC.length, 'Not all products inserted into store database');
        dbTest.close();
        done();
      });
    });
  });

});
