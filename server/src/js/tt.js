/* eslint-env */
/* eslint no-unused-vars: 0 */
/* globals */
'use strict';
let vue = require('vue');

vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{todo.text}}</li>'
});

let app7 = new vue({
  el: '#app-7',
  data() {
    return {
      groceryList: [
        { text: 'Vegetables' },
        { text: 'Cheese' },
        { text: 'Whatever else humans are supposed to eat' }]
    };
  }
});
window.app = app7;
