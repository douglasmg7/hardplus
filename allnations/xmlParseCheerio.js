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
});

// create db from xml
function xml2db(data, db) {
	let $ = cheerio.load(data, {xmlMode: true});
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
}

	// 	// console.log($(this).text());
