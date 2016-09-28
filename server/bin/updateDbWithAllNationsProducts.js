#!/usr/bin/env node
'use strict';

// npm modules
const winston = require('winston');
const path = require('path');
// const fs = require('fs');
// const request = require('request');
const mongo = require('mongodb').MongoClient;
// personal modules
const timer = require('./timer.js');
// Interval(min) to run the script.
const INTERVAL_RUN_MIN = 1;
// Signal to run the script to update store db.
const WATCH_FILE_NAME = '.dbChangeAllNations';
const WATCH_FILE = __dirname + '/' + WATCH_FILE_NAME;
// Mongodb Db.
const mongoUrl = 'mongodb://localhost:27017/store';

// Log configuration.
let log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'silly',
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: false
    }),
    new (winston.transports.File)({
      level: 'silly',
      prettyPrint: true,
      silent: false,
      colorize: true,
      timestamp: true,
      filename: path.parse(__filename).name + '.log',
      maxsize: 40000,
      maxFiles: 10,
      json: false
      // pid: 2323
    })
  ]
});

// Keep timer value.
let timerAux;


log.info(`Start -> run interval: \u001b[44m${INTERVAL_RUN_MIN}min\u001b[40m, watch file: \u001b[44m${WATCH_FILE}\u001b[40m`);

// Run script.
setInterval(()=>{
  log.info('Run...');

}, INTERVAL_RUN_MIN * 60000);



// Insert/update data to db.
function dbInsert(xmlData) {
  // Connect to mongo.
  mongo.connect(mongoUrl, (err, db)=>{
    if(err){
      log.err('MongoDb connection.', `err: ${err}`);
    }

    // Convert xml to json (cheerio).
    timer.begin('mongoDbBulk');
    let bulk = db.collection('dealerProducts').initializeUnorderedBulkOp();
    log.info('Products received.', {products_count: $('Produtos').length});
    $('Produtos').each(function(i, el) {
      bulk
        .find({
          code: ($(el).find('CODIGO').text()).trim(),
          stockLocation: ($(el).find('ESTOQUE').text()).trim()})
        .upsert()
        .updateOne({
          // Data da última atualização do produto
          ts : new Date(($(el).find('TIMESTAMP').text()).trim()),
          // Departamento do produto.
          department: ($(el).find('DEPARTAMENTO').text()).trim(),
          // Categoria do produto.
          category: ($(el).find('CATEGORIA').text()).trim(),
          // Sub-categoria do produto.
          subCategory: ($(el).find('SUBCATEGORIA').text()).trim(),
          // Fabricante do produto.
          manufacturer: ($(el).find('FABRICANTE').text()).trim(),
          // Identificador do produto.
          code: ($(el).find('CODIGO').text()).trim(),
          // Descrição do produto.
          desc: ($(el).find('DESCRICAO').text()).trim(),
          // Descrição técnica do produto.
          tecDesc: ($(el).find('DESCRTEC').text()).trim(),
          // Código do fabricante - não usado.
          partNum: ($(el).find('PARTNUMBER').text()).trim(),
          // Código de barras.
          ean: ($(el).find('EAN').text()).trim(),
          // Garantia em meses.
          warranty: parseInt(($(el).find('GARANTIA').text()).trim()),
          // Peso (kg).
          weight: parseFloat(($(el).find('PESOKG').text()).trim()),
          // Preço praticado pela All Nations para revenda.
          price: parseFloat(($(el).find('PRECOREVENDA').text()).trim()),
          // Preço praticado pela All Nations para revenda sem ST.
          priceNoST: parseFloat(($(el).find('PRECOSEMST').text()).trim()),
          // Situação do produto.
          // 0-indisponível no momento, 1-disponível.
          available: parseInt(($(el).find('DISPONIVEL').text()).trim()),
          // Caminho para a imagem do produto no site da All Nations.
          urlImg: ($(el).find('URLFOTOPRODUTO').text()).trim(),
          // Estoque de origem do produto (RJ, SC e ES).
          stockLocation: ($(el).find('ESTOQUE').text()).trim(),
          // Código de classificação fiscal.
          ncm: ($(el).find('NCM').text()).trim(),
          // Largura em centímetros
          width: parseFloat(($(el).find('LARGURA').text()).trim()),
          // Altura em centímetros
          height: parseFloat(($(el).find('ALTURA').text()).trim()),
          // Profundidade em centímetros
          deep: parseFloat(($(el).find('PROFUNDIDADE').text()).trim()),
          // Produto ativo para venda.
          // 0-não ativo, 1-ativo.
          active: parseInt(($(el).find('ATIVO').text()).trim()),
          // Indica se incide ICMS ST sobre o produto.
          //  0-não incide ICMS ST, 1-Incide ICMS ST.
          taxReplace: parseInt(($(el).find('SUBSTTRIBUTARIA').text()).trim()),
          // Indica a origem do produto (nacional, importado, adquirido no mercado interno, entre outros).
          origin: ($(el).find('ORIGEMPRODUTO').text()).trim(),
          // Estoque disponível no momento da consulta (max = 100);
          stockQtd: parseFloat(($(el).find('ESTOQUEDISPONIVEL').text()).trim())
        });
    });
    timerAux = timer.end('mongoDbBulk');
    log.info('MongoDb bulk created.', {spend_time_bulk: timerAux});
    timer.begin('dbInsert');
    bulk.execute((err, r)=>{
      if(err){
        log.err('Error inserting products on mongoDb', {err: err});
      }
      else{
        timerAux = timer.end('dbInsert');
        log.info('MongoDb insert.', {spend_time_mongodb_insert: timerAux});
        log.debug('MongoDb insert.', {mongodb_insert: r.toJSON()});
      }
      // Include fields market and idStore.
      timer.begin('dbUpdate');
      db.collection('dealerProducts').updateMany(
        {market: {$exists: false}},
        {$set: {market: false, idStore: ''}})
        .then(r=>{
          timerAux = timer.end('dbUpdate');
          log.info('MongoDb update.', {spend_time_mongodb_update: timerAux});
          log.debug('MongoDb update.', {mongodb_update: r.toJSON()});
        })
        .catch(err=>{
          log.err('Error updating products.market on mongoDb', {err: err});
        });
      db.close();
    });
  });
}
