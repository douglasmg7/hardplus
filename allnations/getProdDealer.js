#!/usr/bin/env node
'use strict';

const path = require('path');
let request = require('request');
let assert = require('assert');

// // verify correct number of parameters
// if (process.argv.length <= 2) {
//   console.log('usage: ' + path.basename(__filename) + ' date');
//   return;
// }

let dtSearch = new Date(2016, 5, 1);

console.log(dtSearch.getDate());
console.log(dtSearch.getMonth());
console.log(dtSearch.getFullYear());
console.log(dtSearch.toString());
// console.log(process.argv);


// let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30T09:00:00-03:00';
// // let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30';
//
// request.get(url, (err, res, body) => {
// 	assert.equal(null, err);
// 	console.log(body);
// });
