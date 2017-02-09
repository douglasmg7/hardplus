'use strict';

// npm modules
const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;
// const fs = require('fs');
// signal to run the script to update store products collections with All Nations products
// const wdUpdateAllNationProductsFileName = require('../bin/watchDogConfig').updateAllNationProductsFileName;

// Get all products.
router.get('/', function (req, res) {
  mongo.db.collection(dbConfig.collAllNationProducts).find().limit(30).toArray((err, r) => {
    if (err) {
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

// commercialize product
router.put('/set-commercialize/:_id', function(req, res) {
  const commercialize = req.body.commercialize === true;
  // change product
  // mongodb formated _id product
  const _id = new ObjectId(req.params._id);
  // update all nations db
  mongo.db.collection(dbConfig.collAllNationProducts).findOneAndUpdate({_id: _id}, {$set: {commercialize: commercialize}}, {returnOriginal: false})
  .then(result=>{
    const product = result.value;
    return mongo.db.collection(dbConfig.collStoreProducts).updateOne({_id: _id},
      {$set: {
        dealer: 'AllNations',
        dealerProductId: product.code,
        dealerProductLastUpdate: product.ts,
        dealerProductTitle: product.desc,
        dealerProductDesc: product.tecDesc,
        dealerProductWarrantyPeriodDays: product.warranty,
        dealerProductPrice: product.price,
        dealerProductPriceNoST: product.priceNoST,
        dealerProductLocation: product.stockLocation,
        dealerProductWeightG: product.weight * 1000,
        dealerProductWidthMm: product.width * 1000,
        dealerProductHeightMm: product.height * 1000,
        dealerProductDeepMm: product.deep * 1000,
        dealerProductActive: (product.available && product.active),
        dealerProductQtd: product.stockQtd,
        dealerProductCommercialize: product.commercialize
      }}, {upsert: true});
  }).then(result=>{
    console.log(`set-commercialize -> _id: ${req.params._id}, commercialize: ${commercialize}`);
    if (result.modifiedCount === 1 || result.upsertedCount === 1) {
      res.json({'status': 'success'});
    }
  }).catch((err)=>{
    console.log(`Error: set-commercialize, _id: ${req.params._id}, err: ${err}`);
    res.json({'status': 'fail'});
  });
});
module.exports = router;
