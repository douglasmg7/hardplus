#!/usr/bin/env node
// maybe lost some data if the two server have diferent time

'use strict';

const path = require('path');
const fs = require('fs');
const request = require('request');
const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const cheerio = require('cheerio');

// Interval(min) to run the script.
const INTERVAL_RUN_MIN = 1;
// Interval(min) between querys.
const INTERVAL_QUERY_MIN = 4;
// Keep last query time into a file.
const LAST_QUERY_FILE_NAME = '.last_query';
const LAST_QUERY_FILE = __dirname + '/' + LAST_QUERY_FILE_NAME;
// Quering for the first time.
const BEGIN_QUERY = '2015-01-01T00:00:00.000Z';
// Mongodb configuration
const mongoUrl = 'mongodb://localhost:27017/store';
// Last query date to use into next query.
let lastQuery;

// console.log(dtSearch.toISOString());
// console.log(dtSearch.getTimezoneOffset());
// 2016-06-01T03:00:00.000Z
// 2016-08-30T09:00:00-03:00';

console.log('Script started');
// Run script.
let timeout = setInterval(()=>{
  console.log('Running script');
  // Alredy has the last query time.
  if (lastQuery) {
    // Make the query.
    reqWS(lastQuery);
  }
  // Read date of last query from file.
  else {
    getDateLastQuery();
  }
}, INTERVAL_RUN_MIN * 60000);

// Read last query time from file.
function getDateLastQuery() {
  console.log(`Reading ${LAST_QUERY_FILE}`);
  // Read file with last query date.
  fs.readFile(LAST_QUERY_FILE, 'utf8', (err, data)=>{
    if (err) {
      // No last query file to read.
      if(err.code == 'ENOENT'){
        lastQuery = new Date(BEGIN_QUERY);
        console.log('starting query from begin');
      }
      // No expected error.
      else {
        throw err;
      }
    }
    // Get last query.
    else {
      // Update last query file.
      lastQuery = new Date((data).trim());
      console.log(`Last Query read from file: ${lastQuery.toISOString()}`);
      // Make the query.
      reqWS();
    }
  });
}

// Make request to web service.
function reqWS() {
  // Elapsed time.
  let now = new Date();
  console.log(`Last query: ${lastQuery.toISOString()}`);
  console.log(`Now       : ${now.toISOString()}`);
  let elapsedTimeMin = Math.ceil((now.getTime() - lastQuery.getTime()) / 60000);
  console.log(`Elapsed time: ${elapsedTimeMin}min`);
  // No time to query.
  if (elapsedTimeMin < INTERVAL_QUERY_MIN) {
    return;
  }
  // Make the query.
  console.log('making query');
  // let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30T09:00:00-03:00';
  let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=' + lastQuery.toISOString();
  // Request to ws.
  request.get(url, (err, res, body) => {
  	assert.equal(null, err);
    // Insert to db.
    dbInsert(body);
    // Write xml result to file.
    let xmlFile = __dirname + '/' + lastQuery.toISOString() + '--' + now.toISOString() + '.xml';
    fs.writeFile(xmlFile, body, (err)=>{
      assert.equal(null, err);
      console.log(`${xmlFile} saved`);
    });
    // Write last query date to file.
    fs.writeFile(LAST_QUERY_FILE, now.toISOString(), (err)=>{
      assert.equal(null, err);
      console.log(`${LAST_QUERY_FILE} saved`);
      console.log(now.toISOString());
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
      db.close();
    });
  });
}
