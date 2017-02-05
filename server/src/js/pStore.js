/* eslint no-unused-vars: off */
'use strict';

// require ('../../semantic/dist/semantic.min.css');
// require ('../../dist/css/pStore.css');
// let $ = require('jquery');
// require('../../semantic/dist/semantic.min.js');

import Vue from 'vue';
import vueResource from 'vue-resource';
Vue.use(vueResource);
// components
import pStoreApp from './pStoreApp.vue';
import menuProducts from './menuProducts.vue';

window.app_vue = new Vue({
  el: '#app',
  data: {
    msg: 'Products Store'
  },
  components: {
    pStoreApp,
    menuProducts
  }
});
