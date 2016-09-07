'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');

// let colStore = mongo.db;
// var col = mongo.db.collection('find');
// let colStore = mongo.db.collection('store');

// mongo.db.stats((err, stats)=>{
//   console.log(stats);
// });

// console.log('all: ' + mongo.db);
// setTimeout(()=>{
//   console.log('all: ' + mongo.db);
// }, 2000);

// router.get('/', function(req, res, next) {
//   res.json({code: '32', name: 'memory'});
// });

router.get('/', function(req, res, next) {
  mongo.db.collection('dealerProducts').find().toArray((err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

router.get('/:id', function(req, res, next) {
  mongo.db.collection('dealerProducts').findOne({code: '0059989'}, (err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

module.exports = router;
