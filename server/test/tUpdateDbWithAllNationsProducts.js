#!/usr/bin/env node
/* eslint-env mocha */
'use strict';
process.env.NODE_ENV = 'test';

// Npm modules.
const expect = require('chai').expect;
const mongo = require('mongodb').MongoClient;
// personal modules
const productsAllNations = require('./allNationsProducts.json');
const productsStore = require('./storeProducts.json');
const dbConfig = require('../bin/dbConfig');
// Module to test.
const AllNations = require('../bin/updateDbWithAllNationsProducts');

// Db connection used into the test.
let dbTest = null;
// All Nations products to be commercialized.
let productsANC = null;

// Initialize All Nations collections.
function initAllNationsCollection(db, callback){
  let col = db.collection(dbConfig.collAllNationProducts);
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
  let col = db.collection(dbConfig.collStoreProducts);
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
    mongo.connect(dbConfig.urlTest, (err, db)=>{
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
    AllNations.connectDb(dbConfig.urlTest, db=>{
      expect(db.databaseName).to.equal(dbConfig.dbNameTest);
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
        'flt-hrd',
        'flt-hrd',
        'key-hrd',
        'mouse-hrd',
        'pen-drive-hrd'
      ];
      for (let i = 0; i < products.length; i++) {
        expect(products[i].idStore).to.have.string(idStoreTest[i]);
      }
      // To be used into the next test.
      productsANC = products;
      done();
    });
  });

  it ('Store products database configured for test.', done=>{
    let col = dbTest.collection(dbConfig.collStoreProducts);
    col.find().toArray((err, products)=>{
      // Verify data before insert.
      expect(products).to.be.lengthOf(2, 'Number of documents on database is wrong for make tests');
      // Product 1.
      let flt = products.find(product => product.dealerCode==='0046860');
      expect(flt.idStore).to.equal('flt-hrd');
      expect(flt.dealer).to.equal('AllNations');
      expect(flt.dealerCode).to.equal('0046860');
      expect(flt.dealerProductDesc).to.equal('FILTRO DE LINHA PCTOP 3 TOMADAS FLP-03');
      expect(flt.price).to.equal(7.77);
      expect(flt.stockLocation).to.equal('ES');
      expect(flt.active).to.equal(0);
      expect(flt.stockQtd).to.equal(49);
      // Product 2.
      let lapTop = products.find(product => product.dealerCode==='0061338');
      expect(lapTop.idStore).to.equal('laptop-hrd');
      expect(lapTop.dealer).to.equal('AllNations');
      expect(lapTop.dealerCode).to.equal('0061338');
      expect(lapTop.dealerProductDesc).to.equal('LAPTOP B');
      expect(lapTop.price).to.equal(2114.33);
      expect(lapTop.stockLocation).to.equal('ES');
      expect(lapTop.active).to.equal(1);
      expect(lapTop.stockQtd).to.equal(33);
      done();
    });
  });

  it('Insert\/update products into store database.', done=>{
    AllNations.insertProductsStore(dbTest, productsANC, ()=>{
      let col = dbTest.collection(dbConfig.collStoreProducts);
      col.find().toArray((err, products)=>{
        // Number of products that alredy exist and will not be updated or inserted.
        let existProduct = 1;
        // Verify data modifications.
        expect(products).to.be.lengthOf(productsANC.length + existProduct, 'Not all products inserted into store database');
        // Product 1 - just update.
        let flt = products.find(product => product.dealerCode==='0046860');
        expect(flt.idStore).to.equal('flt-hrd');
        expect(flt.dealer).to.equal('AllNations');
        expect(flt.dealerProductDesc).to.equal('FILTRO DE LINHA PCTOP 3 TOMADAS FLP-03');
        expect(flt.price).to.equal(8.97); // Updated.
        expect(flt.stockLocation).to.equal('ES');
        expect(flt.active).to.equal(1);
        expect(flt.stockQtd).to.equal(100); // Updated.
        // Product 2 - not changed.
        let lapTop = products.find(product => product.dealerCode==='0061338');
        expect(lapTop.idStore).to.equal('laptop-hrd');
        expect(lapTop.dealer).to.equal('AllNations');
        expect(lapTop.dealerProductDesc).to.equal('LAPTOP B');
        expect(lapTop.price).to.equal(2114.33);
        expect(lapTop.stockLocation).to.equal('ES');
        expect(lapTop.active).to.equal(1);
        expect(lapTop.stockQtd).to.equal(33);
        // Product 3 - inserted.
        let flt2 = products.find(product => product.dealerCode==='0036677');
        expect(flt2.idStore).to.equal('flt-hrd');
        expect(flt2.dealer).to.equal('AllNations');
        expect(flt2.dealerProductDesc).to.equal('FILTRO DE LINHA PCTOP 3 TOMADAS FLP-03');
        expect(flt2.price).to.equal(11.31);
        expect(flt2.stockLocation).to.equal('RJ');
        expect(flt2.active).to.equal(1);
        expect(flt2.stockQtd).to.equal(95);
        dbTest.close();
        done();
      });
    });
  });

});
