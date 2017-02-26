'use strict';
// npm modules
const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;
const downloadFile = require('../bin/downloadFile');
// page size for pagination
const PAGE_SIZE = 50;
// get products
router.get('/', function (req, res) {
  const page = (req.query.page && (req.query.page > 0)) ? req.query.page : 1;
  const skip = (page - 1) * PAGE_SIZE;
  const search = req.query.search ? {'desc': {$regex: req.query.search, $options: 'i'}} : {};
  const cursor = mongo.db.collection(dbConfig.collAllNationProducts).find(search).sort({'desc': 1}).skip(skip).limit(PAGE_SIZE);
  Promise.all([
    cursor.toArray(),
    cursor.count()
  ]).then(([products, count])=>{
    res.json({products, page, pageCount: Math.ceil(count / PAGE_SIZE)});
  }).catch(err=>{
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
  // update all nations products db
  mongo.db.collection(dbConfig.collAllNationProducts).findOneAndUpdate({_id: _id},
    {$set: {commercialize: commercialize}},
    {returnOriginal: false})
  // upsert store products db
  .then(result=>{
    const product = result.value;
    return mongo.db.collection(dbConfig.collStoreProducts).findOneAndUpdate(
      {_id: _id},
      {
        $set: {
          dealer: 'AllNations',
          dealerProductId: product.code,
          dealerProductLastUpdate: product.ts,
          dealerProductTitle: product.desc,
          dealerProductDesc: product.tecDesc,
          dealerProductWarrantyDays: product.warranty,
          dealerProductPrice: product.price,
          dealerProductPriceNoST: product.priceNoST,
          dealerProductLocation: product.stockLocation,
          dealerProductWeightG: product.weight * 1000,
          dealerProductWidthMm: product.width * 1000,
          dealerProductHeightMm: product.height * 1000,
          dealerProductDeepMm: product.deep * 1000,
          dealerProductActive: (product.available && product.active),
          dealerProductQtd: product.stockQtd,
          dealerProductCommercialize: product.commercialize,
          dealerProductUrlImage: product.urlImg
        },
        $setOnInsert: {
          storeProductId: '',
          storeProductTitle: product.desc,
          storeProductDescPrimary: product.tecDesc,
          storeProductDescComplete: product.tecDesc,
          storeProductCommercialize: false,
          storeProductMarkup: 0,
          storeProductDiscountEnable: false,
          storeProductDiscountType: '%',
          storeProductDiscountValue: 0,
          storeProductPrice: product.price,
          storeProductMaker: '',
          storeProductCategory: ''
        }
      },
      {upsert: true}
      // {returnOriginal: false, upsert: true, w: 1}
    );
  }).then(result=>{
    console.log(`set-commercialize: _id: ${req.params._id}, commercialize: ${commercialize}`);
    res.json({'status': 'success'});
  })
  .catch((err)=>{
    console.log(`error: set-commercialize, _id: ${req.params._id}, err: ${err}`);
    res.json({'status': 'fail'});
  });
});
// get dealer images
router.put('/download-dealer-images/:id', (req, res)=>{
  mongo.db.collection(dbConfig.collStoreProducts).findOne(
    {_id: new ObjectId(req.params.id)},
    {dealerProductUrlImage: true}
  )
  .then(result=>{
    console.log(JSON.stringify(`result: ${JSON.stringify(result)}`));
    // load pictures from dealer
    downloadFile(
      `${result.dealerProductUrlImage}-01`,
      `${result._id}.jpeg`,
      function(){
        console.log(`file from ${result._id} was load`);
      }
    );
    res.json('status: success');
  }).catch(err=>{
    console.log(`error loading dealer images - err: ${err}`);
    res.json('status: fail');
  });
});
module.exports = router;
