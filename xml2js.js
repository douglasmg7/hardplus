#!/usr/bin/env node
'use strict';

let request = require('request');
let assert = require('assert');
let pixlXml = require('pixl-xml');
// let xml2js = require('xml2js');
let fs = require('fs');
let util = require('util');	

fs.readFile(__dirname + '/reqProdList-24_08_2016.out', (err, data)=>{
	assert.equal(null, err);

	console.log(util.inspect(pixlXml.parse(data), false, null));

	// xml2js.parseString(data, {ignoreAttrs: true}, (err2, result)=>{
	// 	assert.equal(null, err2);
	// 	// console.log(result);
	// 	// console.log(JSON.stringify(result));
	// 	// console.log(JSON.parse(JSON.stringify(result)));
	// 	console.log(util.inspect(result, false, null));
	// });


});