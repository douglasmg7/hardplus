#!/usr/bin/env node
'use strict';

// let request = require('request');
let assert = require('assert');
let cheerio = require('cheerio');
let fs = require('fs');
let util = require('util');	
// mongodb configuration
let mongo = require('mongodb').MongoClient;
let mongoUrl = 'mongodb://localhost:27017/mammoth';

mongo.connect(mongoUrl, (err, db)=>{
	assert.equal(null, err);

	// read xml from file
	// fs.readFile(__dirname + '/t.html', (err, data)=>{
	fs.readFile(__dirname + '/reqProdList-01_01_2016.xml', (err, data)=>{
		assert.equal(null, err);
		xml2db(data, db);
		// xml = data;
		// console.log(util.inspect(xml, false, null));
		// console.log(util.inspect(pixlXml.parse(data), false, null));
	});

	db.close();
});


// create db from xml
function xml2db(data, db) {
	let $ = cheerio.load(data, {xmlMode: true});
	let grass = '';

	$('Produtos').each(function(i, el) {

		grass = `{\
ts: ${($(el).find('TIMESTAMP').text()).trim()},
department: ${($(el).find('DEPARTAMENTO').text()).trim()},
category: ${($(el).find('CATEGORIA').text()).trim()},
subCategory: ${($(el).find('SUBCATEGORIA').text()).trim()},
manufacturer: ${($(el).find('FABRICANTE').text()).trim()},
code: ${($(el).find('CODIGO').text()).trim()},
desc: ${($(el).find('DESCRICAO').text()).trim()},
tecDesc: ${($(el).find('DESCRTEC').text()).trim()},
partNum: ${($(el).find('PARTNUMBER').text()).trim()},
ean: ${($(el).find('EAN').text()).trim()},
warranty: ${($(el).find('GARANTIA').text()).trim()},
weight: ${($(el).find('PESOKG').text()).trim()},
price: ${($(el).find('PRECOREVENDA').text()).trim()},
available: ${($(el).find('DISPONIVEL').text()).trim()},
urlImg: ${($(el).find('URLFOTOPRODUTO').text()).trim()},
stockLocation: ${($(el).find('ESTOQUE').text()).trim()},
ncm: ${($(el).find('NCM').text()).trim()},
width: ${($(el).find('LARGURA').text()).trim()},
height: ${($(el).find('ALTURA').text()).trim()},
deep: ${($(el).find('PROFUNDIDADE').text()).trim()},
acive: ${($(el).find('ATIVO').text()).trim()},
taxReplace: ${($(el).find('SUBSTTRIBUTARIA').text()).trim()},
origin: ${($(el).find('ORIGEMPRODUTO').text()).trim()}\
}`;

		console.log(grass);

		// db.collection('dealerProducts').insertOne(grass);

		return false;

	});
}
		// console.log('ts: ' + $(el).find('TIMESTAMP').text());
		// console.log('department: ' + $(el).find('DEPARTAMENTO').text());
		// console.log('category: ' + $(el).find('CATEGORIA').text());
		// console.log('subCategory: ' + $(el).find('SUBCATEGORIA').text());
		// console.log('manufacturer: ' + $(el).find('FABRICANTE').text());
		// console.log('code: ' + $(el).find('CODIGO').text());
		// console.log('desc: ' + $(el).find('DESCRICAO').text());
		// console.log('tecDesc: ' + $(el).find('DESCRTEC').text());
		// console.log('partNum: ' + $(el).find('PARTNUMBER').text());
		// console.log('ean: ' + $(el).find('EAN').text());
		// console.log('warranty: ' + $(el).find('GARANTIA').text());
		// console.log('weight: ' + $(el).find('PESOKG').text());
		// console.log('price: ' + $(el).find('PRECOREVENDA').text());
		// console.log('available: ' + $(el).find('DISPONIVEL').text());
		// console.log('urlImg: ' + $(el).find('URLFOTOPRODUTO').text());
		// console.log('stockLocation: ' + $(el).find('ESTOQUE').text());
		// console.log('ncm: ' + $(el).find('NCM').text());
		// console.log('width: ' + $(el).find('LARGURA').text());
		// console.log('height: ' + $(el).find('ALTURA').text());
		// console.log('deep: ' + $(el).find('PROFUNDIDADE').text());
		// console.log('acive: ' + $(el).find('ATIVO').text());
		// console.log('taxReplace: ' + $(el).find('SUBSTTRIBUTARIA').text());
		// console.log('origin: ' + $(el).find('ORIGEMPRODUTO').text());
		// console.log();
		// console.log($(this).find('CODIGO'));

	// 	return false;
	// 	// console.log($(this).text());


	// 	// db.collection('dealerProducts').insertOne(grass);
	// }

	// console.log($('Produtos').get(0).text());
	
	// console.log($('Produtos').find('CODIGO').text());
	// console.log($('Produtos').length);
	// console.log($('Produtos').text());
	// console.log($('h2').text());