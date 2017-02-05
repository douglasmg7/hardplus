'use strict';

const express = require('express');
const router = express.Router();

// store products
router.get('/store', (req, res)=>{
  res.render('productsStore', { title: 'Hey', message: 'Hello there!'});
});

// store products beta
router.get('/_store', (req, res)=>{
  res.render('pStore');
});

// all nations products
router.get('/allnations', (req, res)=>{
  res.render('productsAllNations');
});

// all nations products beta
router.get('/_allnations', (req, res)=>{
  res.render('_productsAllNations');
});


module.exports = router;
