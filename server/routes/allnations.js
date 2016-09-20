'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('../model/db');

router.get('/', function(req, res) {
  mongo.db.collection('dealerProducts').find().limit(20).toArray((err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

router.get('/:id', function(req, res) {
  mongo.db.collection('dealerProducts').findOne({code: '0059989'}, (err, r)=>{
    if(err){
      console.log('Error getting data');
    }
    res.json(r);
  });
});

module.exports = router;
