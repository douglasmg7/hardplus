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
      console.log('Error getting store products: ${err}');
    }
    res.json(r);
  });
});

// update a store product
router.put('/:id', function(req, res) {
  // error if try to update document id
  delete req.body._id;

  mongo.db.collection(dbConfig.collStoreProducts).updateOne({_id: new ObjectId(req.params.id)}, {$set: req.body}, (err, r)=>{
    if(err){
      console.log(`Error updatting store poduct: ${err}`);
      res.json('status: fail');
    } else {
      res.json({
        'matchedCount': r.matchedCount
      });
    }
  });
});

module.exports = router;
