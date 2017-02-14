'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const ObjectId = require('mongodb').ObjectId;
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
// // Get all products
// router.get('/', function(req, res) {
//   mongo.db.collection(dbConfig.collStoreProducts).find().limit(30).toArray((err, r)=>{
//     if(err){
//       console.log('Error getting store products: ${err}');
//     }
//     res.json(r);
//   });
// });
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

module.exports = router;
