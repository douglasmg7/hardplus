#!/usr/bin/env node
'use strict';

let request = require('request');
let assert = require('assert');
let xml = require('pixl-xml');

// 24 08 2016
let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=24 ago 2016';

// 01 01 2016
// let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=01 jan 2016';

request.get(url, (err, res, body) => {
	assert.equal(null, err);
	console.log(body);
	// console.log(xml.parse(body));
});