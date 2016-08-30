#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
let request = require('request');
let assert = require('assert');

// let timeout = setInterval(()=>{
//   console.log(__dirname);
// }, 5000);

// // verify correct number of parameters
// if (process.argv.length <= 2) {
//   console.log('usage: ' + path.basename(__filename) + ' date');
//   return;
// }

function getLastUpdateDate() {
  console.log(fs.readdirSync(__dirname));
}

fs.readFile(__dirname + '/.last_product_req', 

let dtSearch = new Date();

// console.log(dtSearch.getDate());
// console.log(dtSearch.getMonth());
// console.log(dtSearch.getFullYear());
// console.log(dtSearch.toString());
console.log(dtSearch.toISOString());
// console.log(dtSearch.getTimezoneOffset());
// 2016-06-01T03:00:00.000Z
// 2016-08-30T09:00:00-03:00';
// console.log(process.argv);


// let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30T09:00:00-03:00';
// // let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30';
//
// request.get(url, (err, res, body) => {
// 	assert.equal(null, err);
// 	console.log(body);
// });
