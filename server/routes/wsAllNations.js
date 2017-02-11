'use strict';

// npm modules
const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;
// pagination
const PAGE_SIZE = 50;
// const fs = require('fs');
// signal to run the script to update store products collections with All Nations products
// const wdUpdateAllNationProductsFileName = require('../bin/watchDogConfig').updateAllNationProductsFileName;

// get products
router.get('/', function (req, res) {
  const page = (req.query.page && (req.query.page > 0)) ? req.query.page : 1;
  const skip = (page - 1) * PAGE_SIZE;
  const search = req.query.search ? {'desc': {$regex: req.query.search, $options: 'i'}} : {};
  // get prodcuts and total count
  Promise.all([
    // all prodcuts
    mongo.db.collection(dbConfig.collAllNationProducts).find(search).sort({'desc': 1}).skip(skip).limit(PAGE_SIZE).toArray(),
    // all products count
    mongo.db.collection(dbConfig.collAllNationProducts).count()
  ])
  .then((result)=>{
    let pageCount;
    // rsult from search, there is a search
    if (Object.keys(search).length > 0) {
      // products count returned from search
      pageCount = Math.ceil(result[0].length / PAGE_SIZE);
      console.log(`number of products: ${result[0].length}`);
      console.log(`search count: ${pageCount}`);
    } else{
      // products count db (all products)
      pageCount = Math.ceil(result[1] / PAGE_SIZE);
      console.log(`db count: ${pageCount}`);
    }
    res.json({products: result[0], page: page, pageCount: pageCount});
  })
  .catch(err=>{
    console.log(`Error getting data, err: ${err}`);
  });
});

// get specific product
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
