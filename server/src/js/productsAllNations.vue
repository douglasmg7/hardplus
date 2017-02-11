<template lang='pug'>
  div
    menu-products(active='allNations' v-on:input='search=arguments[0]' v-on:search='getProducts()')
    table.ui.compact.table
      thead
        tr
          // th.text-capitalize id
          th.clickable(@click="selectColOrder('desc')") Descrição
          th.clickable(@click="selectColOrder('stockQtd')") Estoque
          th.clickable(@click="selectColOrder('priceNum')") Preço
          th.clickable(@click="selectColOrder('available')") Disp
          th.clickable(@click="selectColOrder('id-store')") Id loja
      tbody
        tr(
          v-for='product in products'
          v-bind:class='{"commercialize": product.commercialize, "available-prd": product.available, "active-prd": product.active, "stock-prd": product.stockQtd > 5 }'
        )
          // td {{$index + 1}}
          td.clickable(@click="showProductDetail(product)" v-bind:data-code="product.code") {{product.desc}}
          td.clickable(@click="showProductDetail(product)") {{product.stockQtd}}
          td.clickable(@click="showProductDetail(product)") {{product.price | currencyBr}}
          td.clickable(@click="showProductDetail(product)") {{product.available && product.active ? 'Sim' : 'Não'}}
          td.clickable(@click="showProductDetail(product)") {{product.storeProductId ? product.storeProductId : ''}}
    .ui.hidden.divider
    .ui.center.aligned.container
      .ui.pagination.menu
        div(v-for='n in pageCount')
          a.item(@click='getProducts(n)' v-bind:class='{"active": n==page}') {{n}}
    .ui.hidden.divider
    products-allnations-detail(v-bind:product='productDetail')
</template>
<script>
  /* globals accounting */
  'use strict';
  import accounting from 'accounting';
  // components
  import menuProducts from './menuProducts.vue';
  import productsAllnationsDetail from './productsAllNationsDetail.vue';
  // let veeValidate = require('vee-validate');
  // $(document).ready(function(){
  // });
  const WS_ALL_NATIONS = '/ws/allnations';
  export default {
    components: {
      menuProducts,
      productsAllnationsDetail
    },
    data: function(){
      return {
        // All products.
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
      this.getProducts();
    },
    methods: {
      // retrive products page
      getProducts(page=1){
        this.$http.get(`${WS_ALL_NATIONS}?page=${page}&search=${this.search}`)
          .then((res)=>{
            this.products = res.body.products;
            this.page = res.body.page;
            this.pageCount = res.body.pageCount;
          })
          .catch((err)=>{
            console.log(`Error - getProducts(), err: ${err}`);
          });
      },
      showProductDetail(product){
        this.productDetail = product;

        // open modal
        $('.ui.small.modal')
          .modal('setting', 'duration', 0)
          .modal('show');
      },
      // saveProductStore(product){
      //   this.$http.put(`${WS_PRODUCTS}/${product._id}`, product)
      //     .then((res)=>{
      //       // not could process params
      //       if (res.body.err) {
      //         alert(`erro: ${res.body.err}`);
      //       }
      //       // data modified
      //       else if (res.body.matchedCount && (res.body.matchedCount > 0)){
      //         console.log('Produto atualizado.');
      //       }
      //       else {
      //         alert(`Não foi possível fazer as alterações. result: ${JSON.stringify(res.body)}`);
      //       }
      //     })
      //     .catch((err)=>{
      //       alert(`erro: ${JSON.stringify(err)}`);
      //       console.log(`err: ${JSON.stringify(err)}`);
      //     });
      // }
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
  tr.commercialize
    background-color: #F2DEDE
  /*comercialized and available and active*/
  tr.commercialize.available-prd.active-prd.stock-prd
    background-color: #bdffbd
</style>
