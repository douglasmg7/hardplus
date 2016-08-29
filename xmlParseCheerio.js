#!/usr/bin/env node
'use strict';

// let request = require('request');
let assert = require('assert');
let cheerio = require('cheerio');
let fs = require('fs');
let util = require('util');
// mongodb configuration
let mongo = require('mongodb').MongoClient;
let mongoUrl = 'mongodb://localhost:27017/store';

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
	let strProducts = '';

	console.time('mountObject');

	let products = [];
	$('Produtos').each(function(i, el) {
		let product = {};

		product.ts = ($(el).find('TIMESTAMP').text()).trim();
		product.department = ($(el).find('DEPARTAMENTO').text()).trim();
		product.category = ($(el).find('CATEGORIA').text()).trim();
		product.subCategory = ($(el).find('SUBCATEGORIA').text()).trim();
		product.manufacturer = ($(el).find('FABRICANTE').text()).trim();
		product.code = ($(el).find('CODIGO').text()).trim();
		product.desc = ($(el).find('DESCRICAO').text()).trim();
		product.tecDesc = ($(el).find('DESCRTEC').text()).trim();
		product.partNum = ($(el).find('PARTNUMBER').text()).trim();
		product.ean = ($(el).find('EAN').text()).trim();
		product.warranty = ($(el).find('GARANTIA').text()).trim();
		product.weight = ($(el).find('PESOKG').text()).trim();
		product.price = ($(el).find('PRECOREVENDA').text()).trim();
		product.available = ($(el).find('DISPONIVEL').text()).trim();
		product.urlImg = ($(el).find('URLFOTOPRODUTO').text()).trim();
		product.stockLocation = ($(el).find('ESTOQUE').text()).trim();
		product.ncm = ($(el).find('NCM').text()).trim();
		product.width = ($(el).find('LARGURA').text()).trim();
		product.height = ($(el).find('ALTURA').text()).trim();
		product.deep = ($(el).find('PROFUNDIDADE').text()).trim();
		product.acive = ($(el).find('ATIVO').text()).trim();
		product.taxReplace = ($(el).find('SUBSTTRIBUTARIA').text()).trim();
		product.origin = ($(el).find('ORIGEMPRODUTO').text()).trim();

		products.push(product);

		// if (i == 50) {
		// 	return false;
		// }

	});
	console.timeEnd('mountObject');
	console.log(products[0].code);
	console.log(products[0].price);
	console.log("product count: " + products.length);

	// db.collection('dealerProducts').insertOne(strProducts);
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


	// 	// db.collection('dealerProducts').insertOne(strProducts);
	// }

	// console.log($('Produtos').get(0).text());

	// console.log($('Produtos').find('CODIGO').text());
	// console.log($('Produtos').length);
	// console.log($('Produtos').text());
	// console.log($('h2').text());
