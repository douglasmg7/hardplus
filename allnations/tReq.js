#!/usr/bin/env node
// maybe lost some data if the two server have diferent time

'use strict';

const path = require('path');
const fs = require('fs');
const request = require('request');
const assert = require('assert');

  let now = new Date();
  let lastQuery = new Date('2015');
  console.log(lastQuery.toISOString());
  // lastQuery.setMinutes(lastQuery.getMinutes() - 10);
  // lastQuery.setHours(lastQuery.getHours() - 12);
  // console.log(`Last query: ${lastQuery.toISOString()}`);
  // console.log(lastQuery.toISOString());
  // console.log(lastQuery.getTimezoneOffset());


  if (true) {
    return;
  }

  // let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30T09:00:00-03:00';
  let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=' + lastQuery.toISOString();
  console.log(url);

  request.get(url, (err, res, body) => {
  	assert.equal(null, err);
    // console.log(res);
    // Write xml result to file.
    let xmlFile = __dirname + '/' + lastQuery.toISOString() + '.xml';
    fs.writeFile(xmlFile, body, (err)=>{
      assert.equal(null, err);
      console.log(`${xmlFile} saved`);
    });
  });
