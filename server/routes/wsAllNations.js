'use strict';

// npm modules
const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
// signal to run the script to update store products collections with All Nations products
const wdUpdateAllNationProducts = require('../bin/watchDogConfig').updateAllNationProducts;

// Get all products.
router.get('/', function(req, res) {
  mongo.db.collection(dbConfig.collAllNationProducts).find().limit(30).toArray((err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

// Get specific product.
router.get('/:id', function(req, res) {
  mongo.db.collection(dbConfig.collAllNationProducts).findOne({code: '0059989'}, (err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

// Update a product.
router.put('/:id', function(req, res) {
  // Update product market.
  if (req.body.market !== undefined) {
    // change product
    mongo.db.collection(dbConfig.collAllNationProducts).updateOne({_id: new ObjectId(req.params.id)}, {$set: {market: req.body.market, storeProductId: req.body.storeProductId}}, (err, r)=>{
      if(err){
        console.log('Error change product');
        res.json('status: fail');
      }
      else {
        res.json({
          'matchedCount': r.matchedCount,
          'modifiedCount': r.modifiedCount
        });
        // write to watch dog
        let wdContent = `watch dog - All Nations product changed, id: ${req.params.id}, market: ${req.body.market}, storeProductId: ${req.body.storeProductId}`;
        fs.writeFile(wdUpdateAllNationProducts, wdContent, 'utf-8', (err)=>{
          if(err){
            console.log(`saving watch dog, err: ${err}`);
          } else {
            console.log(wdContent);
          }
        });
      }
    });
  }
  // // Update product id to referece.
  // else if (req.body.idStore !== undefined) {
  //   console.log(`id: ${req.params.id}, idStore: ${req.body.idStore}`);
  //   mongo.db.collection(dbConfig.collAllNationProducts).updateOne({_id: new ObjectId(req.params.id)}, {$set: {idStore: req.body.idStore}}, (err, r)=>{
  //     if(err){
  //       console.log(`Error updating idStore from product. _id: ${req.params.id}, idStore: ${req.body.idStore}`);
  //       res.json('status: fail');
  //     }
  //     res.json({
  //       'matchedCount': r.matchedCount,
  //       'modifiedCount': r.modifiedCount
  //     });
  //   });
  //   // res.json({'market update': req.body.market});
  // }
  else
  {
    res.json({err: 'no parameter to update'});
  }
});

module.exports = router;
