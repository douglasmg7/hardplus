#!/usr/bin/env node
'use strict';

// let request = require('request');
let assert = require('assert');
let cheerio = require('cheerio');
let fs = require('fs');
let util = require('util');	

// read xml from file
// fs.readFile(__dirname + '/t.html', (err, data)=>{
fs.readFile(__dirname + '/reqProdList-01_01_2016.xml', (err, data)=>{
	assert.equal(null, err);
	xml2db(data);
	// xml = data;
	// console.log(util.inspect(xml, false, null));
	// console.log(util.inspect(pixlXml.parse(data), false, null));
});

// create db from xml
function xml2db(data) {
	let $ = cheerio.load(data, {xmlMode: true});

	$('Produtos').each(function(i, el) {
		console.log("cod: " + $(el).find('CODIGO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());
		console.log("des: " + $(el).find('DESCRICAO').text());

		
		console.log();
		// console.log($(this).find('CODIGO'));
		if (i == 1) {
			return false;
		}
		// console.log($(this).text());
	});

	// console.log($('Produtos').get(0).text());
	
	// console.log($('Produtos').find('CODIGO').text());
	// console.log($('Produtos').length);
	// console.log($('Produtos').text());
	// console.log($('h2').text());
}

