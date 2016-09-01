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
      // Update last query file to read.
      lastQuery = new Date((data).trim());
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
    // Write xml result to file.
    let xmlFile = __dirname + '/' + lastQuery.toISOString() + '.xml';
    fs.writeFile(xmlFile, body, (err)=>{
      assert.equal(null, err);
      console.log(`${xmlFile} saved`);
    });
    // Insert to db.
    dbInsert(body);
    // Update last query.
    lastQuery = now;
    // Write last query date to file.
    fs.writeFile(LAST_QUERY_FILE, now.toISOString(), (err)=>{
      assert.equal(null, err);
      console.log(`${LAST_QUERY_FILE} saved`);
      console.log(now.toISOString());
    });
  });
}

// Insert/update data to db.
function dbInsert(xmlData) {
  // Connect to mongo.
  mongo.connect(mongoUrl, (err, db)=>{
  	assert.equal(null, err);
    // Convert xml to json (cheerio).
  	let $ = cheerio.load(xmlData, {xmlMode: true});
  	let strProducts = '';
  	console.time('mountObject');
  	let products = [];
  	$('Produtos').each(function(i, el) {
  		let product = {};
  		product.code = ($(el).find('CODIGO').text()).trim();
  		product.ts = ($(el).find('TIMESTAMP').text()).trim();
  		product.desc = ($(el).find('DESCRICAO').text()).trim();
  		product.department = ($(el).find('DEPARTAMENTO').text()).trim();
  		product.category = ($(el).find('CATEGORIA').text()).trim();
  		product.subCategory = ($(el).find('SUBCATEGORIA').text()).trim();
  		product.manufacturer = ($(el).find('FABRICANTE').text()).trim();
  		product.tecDesc = ($(el).find('DESCRTEC').text()).trim();
  		// código do fabricante - não usado
  		product.partNum = ($(el).find('PARTNUMBER').text()).trim();
  		// refinar pesquisa no google - não usado - código do produto no google
  		product.ean = ($(el).find('EAN').text()).trim();
  		product.warranty = ($(el).find('GARANTIA').text()).trim();
  		product.weight = ($(el).find('PESOKG').text()).trim();
  		product.price = ($(el).find('PRECOREVENDA').text()).trim();
  		product.available = ($(el).find('DISPONIVEL').text()).trim();
  		product.urlImg = ($(el).find('URLFOTOPRODUTO').text()).trim();
  		// se o produto está disponível
  		product.stockLocation = ($(el).find('ESTOQUE').text()).trim();
  		// código de classificação fiscal - irá usar
  		product.ncm = ($(el).find('NCM').text()).trim();
  		product.width = ($(el).find('LARGURA').text()).trim();
  		product.height = ($(el).find('ALTURA').text()).trim();
  		product.deep = ($(el).find('PROFUNDIDADE').text()).trim();
  		// não trabalhar com o produto
  		product.acive = ($(el).find('ATIVO').text()).trim();
  		// usado junto com o ncm
  		product.taxReplace = ($(el).find('SUBSTTRIBUTARIA').text()).trim();
  		// se nacional ou importado
  		product.origin = ($(el).find('ORIGEMPRODUTO').text()).trim();
  		products.push(product);
  		// restrict number of itens
  		// if (i == 50) {
  		// 	return false;
  		// }
  	});
  	console.timeEnd('mountObject');
  	console.log(products[0].code);
  	console.log(products[0].price);
  	console.log("product count: " + products.length);
  	console.time('dbInsert');
  	db.collection('dealerProducts').insertMany(products, (err, r)=>{
  		assert.equal(null, err);
  		assert.equal(products.length, r.insertedCount);
  		console.timeEnd('dbInsert');
  		// console.log(r);
  		db.close();
  	});
  });
  //
}
