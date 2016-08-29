#!/usr/bin/env node
'use strict';

let request = require('request');
let assert = require('assert');
let xml = require('pixl-xml');

let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/ConsultarDisponibilidadeProduto?CodigoCliente=0014770&Senha=728626&CodigoProduto=0044819';
request.get(url, (err, res, body) => {
	assert.equal(null, err);
	console.log(body+'\n');
	console.log(xml.parse(body));
});
