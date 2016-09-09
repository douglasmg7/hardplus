// 'use strict';

// var $ = require('jquery');
// var Backbone = require('backbone');
// Backbone.$ = $;


// $("ul").append("<li>Test</li>");
$(function () {
  // $("ul").find( "li" ).css( "background-color", "red" );
  $('#asdf').css( 'background-color', 'red' );
  $('#asdf').html('Changed!');
  $('#insert').append('<li>Novo</li>');
  console.log('begin');
  console.log($('li'));
  console.log('end');
});


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
    var productView = new ProductView({model: products.at(1)});
    console.log(productView.el);
    $('#insert').append(productView.el);
  },
  error: function(model, xhr, options){
    // console.log(Object.keys(xhr).sort());
    // console.log(Object.keys(options));
    // console.log(xhr.responseText);
    // console.log(xhr.statusText);
    // console.log(options.error());
    console.log('Error fetching data');
  }
});
console.log('ptoducts reuqested...');

var ProductView = Backbone.View.extend({
  initialize: function () {
    console.log('New view created.');
    this.render();
  },
  tagName: 'li',
  render: function(){
    console.log(this.model.get('code'));
    this.$el.html(this.model.get('code'));
  }
});
