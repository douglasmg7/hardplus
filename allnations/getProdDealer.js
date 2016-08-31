#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const request = require('request');
const assert = require('assert');

// Interval(min) to run the script.
const INTERVAL_RUN_MIN = 1;
// Interval(min) between querys.
const INTERVAL_QUERY_MIN = 10;
// Keep last query time into a file.
const LAST_QUERY_FILE_NAME = '.last_query';
const LAST_QUERY_FILE = __dirname + '/' + LAST_QUERY_FILE_NAME;
// Quering for the first time.
const BEGIN_QUERY = '2006-06-01T00:00:00.000Z';
// console.log(dtSearch.toISOString());
// console.log(dtSearch.getTimezoneOffset());
// 2016-06-01T03:00:00.000Z
// 2016-08-30T09:00:00-03:00';

// Last query date to use into next query.
let lastQuery;

console.log('Script started');
// Run script.
let timeout = setInterval(()=>{
  console.log('Running script');
  // Alredy has the last query time.
  if (lastQuery) {
    // Make the query.
    query(lastQuery);
  }
  // Get last query time.
  else {
    readLastQueryDate();
  }
}, INTERVAL_RUN_MIN * 60000);

// Read last query date.
function readLastQueryDate() {
  console.log(`Reading ${LAST_QUERY_FILE}`);
  // Read file with last query date.
  fs.readFile(LAST_QUERY_FILE, 'utf8', (err, data)=>{
    if (err) {
      // No last query.
      if(err.code == 'ENOENT'){
        lastQuery = new Date(BEGIN_QUERY);
        console.log('starting query from begin');
      }
      // No expected error.
      else {
        throw err;
      }
    }
    // Get last query.
    else {
      lastQuery = new Date((data).trim());
      query(lastQuery);
    }
  });
}

// Make query from lastQuery.
function query() {
  // Elapsed time.
  let now = new Date();
  console.log(`Last query: ${lastQuery.toISOString()}`);
  console.log(`Now       : ${now.toISOString()}`);
  let elapsedTimeMin = Math.ceil((now.getTime() - lastQuery.getTime()) / 60000);
  console.log(`Elapsed time: ${elapsedTimeMin}min`);
  // No time to query.
  if (elapsedTimeMin < INTERVAL_QUERY_MIN) {
    return;
  }
  // Make the query.
  console.log('making query');
  // let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=2016-08-30T09:00:00-03:00';
  let url = 'http://wspub.allnations.com.br/wsIntEstoqueClientes/ServicoReservasPedidosExt.asmx/RetornarListaProdutos?CodigoCliente=0014770&Senha=728626&Data=' + lastQuery.toISOString();

  // request.get(url, (err, res, body) => {
  // 	assert.equal(null, err);
  //   // Write xml result to file.
  //   let xmlFile = __dirname + '/' + strLastQuery + '.xml';
  //   fs.writeFile(xmlFile, body, (err)=>{
  //     assert.equal(null, err);
  //     console.log(`${xmlFile} saved`);
  //   });
  //
  //   // Insert to db.
  //   // todo
  //
  //   // Write last query date to file.
  //   fs.writeFile(LAST_QUERY_FILE, strLastQuery, (err)=>{
  //     assert.equal(null, err);
  //     console.log(`${LAST_QUERY_FILE} saved`);
  //   });
  // 	// console.log(body);
  // });
  // Write last query date to file.
  fs.writeFile(LAST_QUERY_FILE, now.toISOString(), (err)=>{
    assert.equal(null, err);
    console.log(`${LAST_QUERY_FILE} saved`);
  });
}
