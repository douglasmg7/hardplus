'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const ObjectId = require('mongodb').ObjectId;

// Get all products.
router.get('/', function(req, res) {
  mongo.db.collection('dealerProducts').find().limit(20).toArray((err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

// Get specific product.
router.get('/:id', function(req, res) {
  mongo.db.collection('dealerProducts').findOne({code: '0059989'}, (err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

// Update a product.
router.put('/:id', function(req, res) {
  // console.log(req.body);
  // console.log(req.body.market);

  if (req.body.market) {
    console.log(`mongo - id: ${req.params.id}`);
    mongo.db.collection('dealerProducts').updateOne({_id: new ObjectId(req.params.id)}, {$set: {market: req.body.market}}, (err, r)=>{
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
  else
  {
    res.json({err: 'no parameter to update'});
  }


});

module.exports = router;
