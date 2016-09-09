// 'use strict';
var $ = require('jquery')(window);
var Backbone = require('backbone');
Backbone.$ = $;

// comment.

var product = Backbone.Model.extend({
  defaults: {
  }
});

var Products = Backbone.Collection.extend({
  url: 'http://localhost:3000/allnations'
});

var products = new Products();
products.fetch({
  success: function(){
    console.log('success');
    console.log(products.length);
    console.log(Object.keys(products));
//     console.log(todos.get(1).get('name')); // by id

    console.log(products.at(1).get('code')); // by index
    console.log(Object.keys(products.at(1).attributes));
    // console.log(todos.get(1).get('code')); // by id
    // console.log(todos.at(1).get('title')); // by index
  },
  error: function(model, xhr, options){
    // console.log(Object.keys(xhr).sort());
    // console.log(Object.keys(options));
    // console.log(xhr.responseText);
    // console.log(xhr.statusText);
    // console.log(options.error());
  }
});
console.log('reuqested');
