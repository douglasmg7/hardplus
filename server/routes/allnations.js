'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');

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
