#!/usr/bin/env node
// maybe lost some data if the two server have diferent time

'use strict';
// npm modules
const bunyan = require('bunyan');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const request = require('request');
const mongo = require('mongodb').MongoClient;
const cheerio = require('cheerio');
// personal modules
const timer = require('./timer.js');
// Sensitive data.
const WS_USER = '0014770';
const WS_PASSWORD = '728626';
// Not so Sensitive.
const WS_USER_FAKE = '0000';
const WS_PASSWORD_FAKE = '0000';
// Interval(min) to run the script.
const INTERVAL_RUN_MIN = 1;
// Interval(min) between querys.
const INTERVAL_REQ_MIN = 4;
// Keep last query time into a file.
const LAST_REQ_TIME_FILE_NAME = '.last_req';
const LAST_REQ_TIME_FILE = __dirname + '/' + LAST_REQ_TIME_FILE_NAME;
// First time request.
const LAST_REQ_TIME_INIT = '2015-01-01T00:00:00.000Z';
// Mongodb configuration
const mongoUrl = 'mongodb://localhost:27017/store';
// Last query date to use into next query.
let lastQuery;
// Log configuration.
let log = bunyan.createLogger({
  name: path.parse(__filename).base,
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: path.parse(__filename).name + '.log'
    }
  ]
  // src: true
});

log.info('Script started', {run_interval_min: INTERVAL_RUN_MIN, request_interval_min: INTERVAL_REQ_MIN, last_req_time_file: LAST_REQ_TIME_FILE, last_req_time_init: LAST_REQ_TIME_INIT});
// Read last query time from file.
getLastReqDate();
// Run script.
let timeout = setInterval(()=>{
  log.info('Running script');
  // Request web service.
  reqWS(lastQuery);
}, INTERVAL_RUN_MIN * 60000);

// Read last request date from file.
function getLastReqDate() {
  log.info(`Reading last request time from file.`);
  // Read file with last request date.
  fs.readFile(LAST_REQ_TIME_FILE, 'utf8', (err, data)=>{
    if (err) {
      // No last query file to read.
      if(err.code == 'ENOENT'){
        lastQuery = new Date(LAST_REQ_TIME_INIT);
        log.warn(`No last request time file, using last request time init.`, {last_req_time_init: LAST_REQ_TIME_INIT});
      }
      // No expected error.
      else {
        log.err('Error reading last request time from file', {err: err});
        process.nextTick(process.exit(1));
        // todo: entry test
      }
    }
    // Get last query.
    else {
      // Update last query file.
      lastQuery = new Date((data).trim());
      log.info(`Gotta last request time from file.`, {last_req_time: lastQuery.toISOString()});
      // Make the query.
      reqWS();
    }
  });
}

// Request web service.
function reqWS() {
  // Elapsed time.
  let now = new Date();
  let elapsedTimeMin = Math.ceil((now.getTime() - lastQuery.getTime()) / 60000);
  // No time to query.
  if (elapsedTimeMin < INTERVAL_REQ_MIN) {
    log.info('No elapsed time to make web service request', {last_req_time: lastQuery.toISOString(), now_time: now.toISOString(), elapsed_time_min: elapsedTimeMin});
    return;
  }
  // let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30T09:00:00-03:00';
  // let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=' + lastQuery.toISOString();
  let url = `http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=${WS_USER}&Senha=${WS_PASSWORD}&Data=${lastQuery.toISOString()}`;
  let urlLog = `http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=${WS_USER_FAKE}&Senha=${WS_PASSWORD_FAKE}&Data=${lastQuery.toISOString()}`;
  // Make the query.
  log.info('Making web service request', {last_req_time: lastQuery.toISOString(), now_time: now.toISOString(), elapsed_time_min: elapsedTimeMin, url: urlLog});
  // Request to ws.
  request.get(url, (err, res, body) => {
    if (err) {
      log.err('Error making web service request', {err: err});
      return;
    }
    // Insert to db.
    dbInsert(body);
    // Write xml result to file.
    let xmlFile = __dirname + '/' + lastQuery.toISOString() + '--' + now.toISOString() + '.xml';
    fs.writeFile(xmlFile, body, (err)=>{
      if (err)
        log.err('Error saving xml web service response to file.', {err: err, xml_file: xmlFile});
      else
        log.info('Saved to file - xml web service response.', {xml_file: xmlFile});
    // Write last query date to file.
    });
    fs.writeFile(LAST_REQ_TIME_FILE, now.toISOString(), (err)=>{
      if (err)
        log.err('Error saving last request time to file.', {last_req_time: now.toISOString(), last_req_time_file: LAST_REQ_TIME_FILE});
      else
        log.info('Saved to file - last request time.', {last_req_time: now.toISOString(), last_req_time_file: LAST_REQ_TIME_FILE});
    });
    // Update last query.
    lastQuery = now;
  });
}

// Insert/update data to db.
function dbInsert(xmlData) {
  // Connect to mongo.
  mongo.connect(mongoUrl, (err, db)=>{
  	assert.equal(null, err);
    // Convert xml to json (cheerio).
  	let $ = cheerio.load(xmlData, {xmlMode: true});
    let bulk = db.collection('dealerProducts').initializeUnorderedBulkOp();
    console.time('mountObject');
    console.log('products count: ' + $('Produtos').length);
  	$('Produtos').each(function(i, el) {
      bulk
        .find({
          code: ($(el).find('CODIGO').text()).trim(),
          stockLocation: ($(el).find('ESTOQUE').text()).trim()
          })
        .upsert()
        .updateOne({
          code: ($(el).find('CODIGO').text()).trim(),
          stockLocation: ($(el).find('ESTOQUE').text()).trim(),
          ts : ($(el).find('TIMESTAMP').text()).trim(),
          desc: ($(el).find('DESCRICAO').text()).trim(),
          // Produto ativo para venda.
          acive: ($(el).find('ATIVO').text()).trim(),
          available: ($(el).find('DISPONIVEL').text()).trim(),
          price: ($(el).find('PRECOREVENDA').text()).trim(),
          tecDesc: ($(el).find('DESCRTEC').text()).trim(),
          department: ($(el).find('DEPARTAMENTO').text()).trim(),
          category: ($(el).find('CATEGORIA').text()).trim(),
          subCategory: ($(el).find('SUBCATEGORIA').text()).trim(),
          manufacturer: ($(el).find('FABRICANTE').text()).trim(),
          // Código do fabricante - não usado.
          partNum: ($(el).find('PARTNUMBER').text()).trim(),
          // Código de barras.
          ean: ($(el).find('EAN').text()).trim(),
          warranty: ($(el).find('GARANTIA').text()).trim(),
          weight: ($(el).find('PESOKG').text()).trim(),
          width: ($(el).find('LARGURA').text()).trim(),
          height: ($(el).find('ALTURA').text()).trim(),
          deep: ($(el).find('PROFUNDIDADE').text()).trim(),
          urlImg: ($(el).find('URLFOTOPRODUTO').text()).trim(),
          // Código de classificação fiscal.
          ncm: ($(el).find('NCM').text()).trim(),
          // Usado junto com o ncm.
          taxReplace: ($(el).find('SUBSTTRIBUTARIA').text()).trim(),
          // Se o produto é de origem nacional ou exterior.
          origin: ($(el).find('ORIGEMPRODUTO').text()).trim()
        });
  	});
  	console.timeEnd('mountObject');
  	console.time('dbInsert');
    bulk.execute((err, r)=>{
      assert.equal(null, err);
      console.log(r.toJSON());
      console.timeEnd('dbInsert');
      db.close();      // err ? log.err('Error saving xml web service response to file.', {err: err, xml_file: xmlFile})
      //     : log.info('Saved to file - xml web service response.', {xml_file: xmlFile})
    });
  });
}


// console.log(dtSearch.toISOString());
// console.log(dtSearch.getTimezoneOffset());
