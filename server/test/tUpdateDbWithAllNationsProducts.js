#!/usr/bin/env node
/* eslint-env mocha */
'use strict';

const expect = require('chai').expect;
// const updateDbWithAllNationsProducts = require('../updateDbWithAllNationsProducts');
const mongo = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017/storeTest';
const productsAllNations = require('./productsAllNations2.json');

before(()=>{
  // Pupulate db.
  mongo.connect(mongoUrl, (err, db)=>{
    expect(err).to.equal(null);
    console.log(productsAllNations);
    // console.log('test');
    // db.collection('dealerProducts').insertMany(productsAllNations, (err, r)=>{
    //   // expect(err).to.equal(null);
    //   // expect(r)
    // });
  });
});

describe('Math', function(){
  it('returns the biggest number from arguments', function(){
    var max = Math.max(1 ,2 ,10, 3);
    expect(max).to.equal(10);
  });
});
