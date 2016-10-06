'use strict';

// Database name.
const DB_NAME = 'hardPlus';
// Database name for test.
const DB_NAME_TEST = DB_NAME + 'Test';

let dbConfig = {
  // Database name.
  dbName: DB_NAME,
  // Database name for test.
  dbNameTest: DB_NAME_TEST,
  // Mongodb connection.
  url: `mongodb://localhost:27017/${DB_NAME}`,
  // Mongodb connections for test.
  urlTest: `mongodb://localhost:27017/${DB_NAME_TEST}`,
  // All Nations products collections.
  collAllNationProducts: 'allNationsProducts',
  // Store products collections.
  collStoreProducts: 'hardPlusProducts'
};

module.exports = dbConfig;
