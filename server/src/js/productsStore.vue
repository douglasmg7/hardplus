<template lang='pug'>
  div
    menu-products(active='store' v-on:input='search=arguments[0]' v-on:search='getProducts()')
    table.ui.compact.striped.table
      thead
        tr
          // th.text-capitalize id
          th.clickable(@click="selectColOrder('code-store')") Hardplus id
          th.clickable(@click="selectColOrder('dealer')") Revendedor
          th.clickable(@click="selectColOrder('stockLocation')") local
          th.clickable(@click="selectColOrder('dealerCode')") Rev Id
          th.clickable(@click="selectColOrder('dealerCode')") Rev Titulo
          th.clickable(@click="selectColOrder('stockQtd')") estoque
          th.clickable(@click="selectColOrder('priceNum')") preço
      tbody
        tr(v-for="product in products")
          // td {{$index + 1}}
          td.clickable(@click="showProductDetail(product)" v-bind:data-code="product.code" v-bind:title='product.dealerProductTitle') {{product.storeProductId}}
          td.clickable(@click="showProductDetail(product)") {{product.dealer}}
          td.clickable(@click="showProductDetail(product)") {{product.dealerProductLocation}}
          td.clickable(@click="showProductDetail(product)") {{product.dealerProductId}}
          td.clickable(@click="showProductDetail(product)") {{product.dealerProductTitle}}
          td.clickable(@click="showProductDetail(product)") {{product.dealerProductQtd}}
          //   td {{product.dealerProductPrice | currencyBr}}
          td.clickable(@click="showProductDetail(product)") {{product.dealerProductPrice}}
    .ui.hidden.divider
    .ui.center.aligned.container
      .ui.pagination.menu
        div(v-for='n in pageCount')
          a.item(@click='getProducts(n)' v-bind:class='{"active": n==page}') {{n}}
    .ui.hidden.divider
    products-store-detail(v-bind:product='productDetail')
</template>
<script>
  /* globals accounting */
  'use strict';
  import accounting from 'accounting';
  // components
  import menuProducts from './menuProducts.vue';
  import productsStoreDetail from './productsStoreDetail.vue';
  // let veeValidate = require('vee-validate');
  $(document).ready(function(){
    // initialize dropdown
    $('.ui.dropdown')
      .dropdown({duration: 0});
  });
  const WS_PRODUCTS = '/ws/products';
  export default {
    components: {
      menuProducts,
      productsStoreDetail
    },
    data: function(){
      return {
        products: ['void'],
        productDetail: {},
        // curret page for pagination
        page:1,
        // number of pages for pagination
        pageCount: 1,
        // text for search products
        search: ''
      }
    },
    created() {
      this.$http.get(WS_PRODUCTS)
        .then((res)=>{
          this.products = res.body;
        })
        .catch((err)=>{
          console.log(err);
        });
    },
    methods: {
      showProductDetail(product){
        this.productDetail = product;
        // open modal
        $('.ui.small.modal')
          .modal('setting', 'duration', 0)
          .modal('show');
      },
      saveProductStore(product){
        this.$http.put(`${WS_PRODUCTS}/${product._id}`, product)
          .then((res)=>{
            // not could process params
            if (res.body.err) {
              alert(`erro: ${res.body.err}`);
            }
            // data modified
            else if (res.body.matchedCount && (res.body.matchedCount > 0)){
              console.log('Produto atualizado.');
            }
            else {
              alert(`Não foi possível fazer as alterações. result: ${JSON.stringify(res.body)}`);
            }
          })
          .catch((err)=>{
            alert(`erro: ${JSON.stringify(err)}`);
            console.log(`err: ${JSON.stringify(err)}`);
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
  th.clickable, td.clickable
     cursor: pointer
  /*comercialized but not available or not active*/
  tr.market
    background-color: #F2DEDE
  /*comercialized and available and active*/
  tr.market.available-prd.active-prd.stock-prd
    background-color: #bdffbd
</style>
