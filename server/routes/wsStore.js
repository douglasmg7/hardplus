'use strict';
const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;
const path = require('path');
const fs = require('fs');
// file upload
const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, callback){
    const DIR_IMG_PRODUCT = path.join(__dirname, '..', 'dist/img/allnations/products', req.params.id);
    console.log(DIR_IMG_PRODUCT);
    fs.mkdir(DIR_IMG_PRODUCT, err=>{
      // other erro than file alredy exist
      if (err && err.code !== 'EEXIST') {
        console.log(`error creating path upload images - err: ${err}`);
      } else {
        callback(null, DIR_IMG_PRODUCT);
      }
    });
  },
  filename(req, file, callback){
    callback(null, 'upload-img-' + Date.now() + path.extname(file.originalname));
  }
});
// const upload = multer({dest: path.join(__dirname, '..', 'dist', 'uploads')});
const upload = multer({storage: storage});
// page size for pagination
const PAGE_SIZE = 50;
// get products
router.get('/', function (req, res) {
  const page = (req.query.page && (req.query.page > 0)) ? req.query.page : 1;
  const skip = (page - 1) * PAGE_SIZE;
  const search = req.query.search
    ? {'dealerProductCommercialize': true, 'desc': {$regex: req.query.search, $options: 'i'}}
    : {'dealerProductCommercialize': true};
    // : {'dealerProductCommercialize': {$exists: true, $eq: true}};
  const cursor = mongo.db.collection(dbConfig.collStoreProducts).find(search).sort({'storeProductTitle': 1}).skip(skip).limit(PAGE_SIZE);
  Promise.all([
    cursor.toArray(),
    cursor.count()
  ]).then(([products, count])=>{
    res.json({products, page, pageCount: Math.ceil(count / PAGE_SIZE)});
  }).catch(err=>{
    console.log(`Error getting data, err: ${err}`);
  });
});
// Get dropdown elements
router.get('/dropdown', function(req, res) {
  Promise.all([
    mongo.db.collection(dbConfig.collProductMakers).find().sort({name: 1}).toArray(),
    mongo.db.collection(dbConfig.collProductCategories).find().sort({name: 1}).toArray()
  ]).then(([productMakers, productCategories])=>{
    res.json({productMakers, productCategories});
  })
  .catch(err=>{
    console.log(`Error dropdwon: ${err}`);
  });
});
// update a store product
router.put('/:id', function(req, res) {
  // error if try to update document id
  delete req.body._id;
  mongo.db.collection(dbConfig.collStoreProducts).updateOne(
    {_id: new ObjectId(req.params.id)},
    {$set: req.body}
  )
  .then(result=>{
    res.json('status: success');
  }).catch(err=>{
    console.log(`saving store products detail - err: ${err}`);
    res.json('status: fail');
  });
});
// upload product pictures
router.put('/upload-product-images/:id', upload.array('pictures[]', 8), (req, res)=>{
  console.log(`uploadPictures-${req.params.id}`);
  res.json('status: success');
});
module.exports = router;
