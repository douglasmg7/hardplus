/* eslint-env */
/* eslint no-unused-vars: 0 */
/* globals */
'use strict';
let vue = require('vue');

vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{todo.text}}{{todo.text}}</li>'
});

let app7 = new vue({
  el: '#app-7',
  data: {
    groceryList: [
      { text: 'Vegetable-s' },
      { text: 'Cheeses--t' },
      { text: '234Whatever else humans are supposed to eat' }]
  }
});

window.app = app7;
