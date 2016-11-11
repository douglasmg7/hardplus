'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;

// Get all products.
router.get('/', function(req, res) {
  mongo.db.collection(dbConfig.collStoreProducts).find().limit(30).toArray((err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});


// Update a product.
router.put('/:id', function(req, res) {
  // console.log(`id: ${req.params.id}, body: ${req.body}`);
  // console.log(req.body.commercialize);
  // Update product commercialize.
  if (req.body.commercialize !== undefined) {
    console.log(`id: ${req.params.id}, commercialize: ${req.body.commercialize}`);
    mongo.db.collection(dbConfig.collAllNationProducts).updateOne({_id: new ObjectId(req.params.id)}, {$set: {commercialize: req.body.commercialize}}, (err, r)=>{
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
    // res.json({'commercialize update': req.body.commercialize});
  }
  // Update product id to referece.
  else if (req.body.idStore !== undefined) {
    console.log(`id: ${req.params.id}, idStore: ${req.body.idStore}`);
    mongo.db.collection(dbConfig.collAllNationProducts).updateOne({_id: new ObjectId(req.params.id)}, {$set: {idStore: req.body.idStore}}, (err, r)=>{
      if(err){
        console.log(`Error updating idStore from product. _id: ${req.params.id}, idStore: ${req.body.idStore}`);
        res.json('status: fail');
      }
      res.json({
        'matchedCount': r.matchedCount,
        'modifiedCount': r.modifiedCount
      });
    });
    // res.json({'commercialize update': req.body.commercialize});
  }
  else
  {
    res.json({err: 'no parameter to update'});
  }
});

module.exports = router;
