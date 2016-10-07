'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
let db = mongo.db;
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;

// Get all products.
router.get('/', function(req, res) {
  console.log('router-get-\/');
  console.log('mongo.db: ' + Object.keys(mongo.db));
  console.log('db: ' + Object.keys(db));
  mongo.db.collection(dbConfig.collAllNationProducts).find().limit(30).toArray((err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    console.log('respondig-json');
    res.json(r);
  });
});

// Get specific product.
router.get('/:id', function(req, res) {
  db.collection(dbConfig.collAllNationProducts).findOne({code: '0059989'}, (err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

// Update a product.
router.put('/:id', function(req, res) {
  // console.log(`id: ${req.params.id}, body: ${req.body}`);
  // console.log(req.body.market);
  // Update product market.
  if (req.body.market !== undefined) {
    console.log(`id: ${req.params.id}, market: ${req.body.market}`);
    db.collection(dbConfig.collAllNationProducts).updateOne({_id: new ObjectId(req.params.id)}, {$set: {market: req.body.market}}, (err, r)=>{
      if(err){
        console.log('Error getting data');
        res.json('status: fail');
      }
      // console.log(`matchedCount: ${r.matchedCount}`);
      // console.log(`modifiedCount: ${r.modifiedCount}`);
      // console.log(`result: ${JSON.stringify(r.result)}`);
      res.json({
        'matchedCount': r.matchedCount,
        'modifiedCount': r.modifiedCount
      });
    });
    // res.json({'market update': req.body.market});
  }
  // Update product id to referece.
  else if (req.body.idStore !== undefined) {
    console.log(`id: ${req.params.id}, idStore: ${req.body.idStore}`);
    db.collection(dbConfig.collAllNationProducts).updateOne({_id: new ObjectId(req.params.id)}, {$set: {idStore: req.body.idStore}}, (err, r)=>{
      if(err){
        console.log(`Error updating idStore from product. _id: ${req.params.id}, idStore: ${req.body.idStore}`);
        res.json('status: fail');
      }
      res.json({
        'matchedCount': r.matchedCount,
        'modifiedCount': r.modifiedCount
      });
    });
    // res.json({'market update': req.body.market});
  }
  else
  {
    res.json({err: 'no parameter to update'});
  }
});

module.exports = router;
