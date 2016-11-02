#!/usr/bin/env node
/* eslint-env mocha */
'use strict';
process.env.NODE_ENV = 'test';

const mongo = require('mongodb').MongoClient;
const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Store products to populate db test.
const productsStore = require('./storeProducts.json');
// Db configurations.
const dbConfig = require('../bin/dbConfig');

// Server to test.
let server = null;

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

describe('Web service products store', ()=>{

  before((done)=>{
    // Pupulate db.
    // Convert timestamp string to date.
    for (let val of productsStore){
      val.ts = new Date(val.ts);
    }
    // Insert store porducts.
    mongo.connect(dbConfig.urlTest, (err, db)=>{
      expect(err).to.equal(null);
      initStoreCollection(db,()=>{
        db.close();
        // Start server.
        let http = require('http');
        let app = require('../app');
        server = http.createServer(app);
        done();
        // server.listen(3001, ()=>{
        //   done();
        // });
      });
    });
  });

  after(()=>{
    // Close server.
    server.close();
  });

  it('get all products', (done)=>{
    chai.request(server)
      .get('/ws/products')
      .end((err, res)=>{
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.lengthOf(2);
        expect(res.body[0].idStore).to.be.a('string');
        expect(res.body[0].dealer).to.be.a('string');
        expect(res.body[0].dealerCode).to.be.a('string');
        expect(res.body[0].dealerProductDesc).to.be.a('string');
        expect(res.body[0].price).to.be.a('number');
        expect(res.body[0].stockLocation).to.be.a('string');
        expect(res.body[0].active).to.be.a('number');
        expect(res.body[0].stockQtd).to.be.a('number');

        done();
      });
  });

});