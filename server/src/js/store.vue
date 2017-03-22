<template lang='pug'>
  div
    .ui.green.inverted.small.borderless.attached.menu
      .ui.container
        a.ui.label.item
          i.big.home.icon Zunka
        .right.item
          .category.search.item
            //- .ui.transparent.icon.input
            .ui.icon.input
              input.prompt(placeholder='O que você procura?')
              i.large.search.link.icon
          a.item
            i.big.cart.icon
    .ui.center.aligned.container
      //- .ui.top.attached.segment
      //- .ui.vertical.very.padded.segment
      .ui.basic.padded.segment
        //- .ui.four.stackable.cards
        .ui.four.doubling.cards
          .ui.card(v-for='product in products')
            a.image(href='#')
              img(:src='"/img/allnations/products/" + product.dealerProductId + "/dealer-img-01.jpeg"')
            .content
              a.header(href='#') {{product.storeProductTitle}}
              .meta R$ {{product.storeProductPrice}}
</template>
<script>
  /* globals accounting */
  'use strict';
  import wsPath from '../../bin/wsPath';
  import accounting from 'accounting';
  // components
  // import menuProducts from './menuProducts.vue';
  // import productsStoreDetail from './productsStoreDetail.vue';
  // let veeValidate = require('vee-validate');
  export default {
    components: {
      // menuProducts,
      // productsStoreDetail
    },
    data: function(){
      return {
        products: ['void'],
        // deep clone of selected product
        selectedProduct: {},
        productMakers: ['void'],
        productCategories: ['void'],
        // curret page for pagination
        page:1,
        // number of pages for pagination
        pageCount: 1,
        // text for search products
        search: ''
      }
    },
    created() {
      this.getProducts();
    },
    methods: {
      // retrive products page
      getProducts(page=1){
        this.$http.get(`${wsPath.store}/products-commercialize/?page=${page}&search=${this.search}`)
          .then((res)=>{
            this.products = res.body.products;
            this.page = res.body.page;
            this.pageCount = res.body.pageCount;
          })
          .catch((err)=>{
            console.log(`Error - getProducts(), err: ${err}`);
          });
      }
    },
    filters: {
      currencyBr(value){
        return accounting.formatMoney(value, 'R$ ', 2, '.', ',');
      }
    }
  }
</script>
<style lang='stylus'>
</style>
