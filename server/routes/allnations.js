'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');

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
  console.log(req.body);
  res.json('status: ok');
  // mongo.db.collection('dealerProducts').updateOne({code: '0059989'}, {$set: {market: true}}, (err, r)=>{
  //   if(err){
  //     console.log('Error getting data');
  //     res.json('status: fail')
  //   }
  //   res.json('status: ok');
  // });
});

module.exports = router;
