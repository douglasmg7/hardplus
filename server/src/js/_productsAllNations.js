/* eslint no-unused-vars: off */
'use strict';
import accounting from 'accounting';
// vue
import Vue from 'vue';
import vueResource from 'vue-resource';
Vue.use(vueResource);
// components
import menuProducts from './menuProducts.vue';
import productsAllnations from './_productsAllNations.vue';


window.app_vue = new Vue({
  el: '#app',
  data: {
    msg: 'Products All Nations'
  },
  components: {
    menuProducts,
    productsAllnations
  }
});
