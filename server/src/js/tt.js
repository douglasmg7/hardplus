/* eslint-env */
/* eslint no-unused-vars: 0 */
/* globals */

'use strict';

let vue = require('vue');
// let vueResource = require('vue-resource');
// vue.use(vueResource);

vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{todo.text}}</li>'
});

let app7 = new vue({
  el: '#app-7',
  data: {
    groceryList: [
      { text: 'Vegetables' },
      { text: 'Cheeses' },
      { text: '234Whatever else humans are supposed to eat' }]
  }
});

window.app = app7;
