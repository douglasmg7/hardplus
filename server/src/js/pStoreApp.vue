<template lang='pug'>
  div
    //- // p uiuiu-{{bandName}}
    //- table.ui.celled.striped.table
    //- table.ui.sortable.line.striped.table
    //- table.ui.sortable.celled.striped.table
    //- table.ui.line.striped.table
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
          td.clickable(@click="openInfo(product)" v-bind:data-code="product.code" data-toggle="modal" data-target="#prd-info" v-bind:title='product.dealerProductTitle') {{product.storeProductId}}
          td {{product.dealer}}
          td {{product.dealerProductLocation}}
          td {{product.dealerProductId}}
          td {{product.dealerProductTitle}}
          td {{product.dealerProductQtd}}
          //   td {{product.dealerProductPrice | currencyBr}}
          td {{product.dealerProductPrice}}
</template>

<script>
  /* globals accounting */
  'use strict';

  // let veeValidate = require('vee-validate');

  const WS_PRODUCTS = '/ws/products';

  export default {
    data: function(){
      return {
        bandName: 'U2-U2',
        // product: {},
        // All products.
        products: [
          {desc:''}
        ],
        productInfo: {},
        // Which column to order.
        orderCol: 'desc',
        // Crescent o decrescent order.
        order: 1,
        // Used by the text filter.
        filterName: '',
        // Each produtc can have one o more pictures url.
        picId: 1,
        inputChangIdStore: '',
        // actived menu
        menuIsActive: {
          allNations: false,
          store: true
        }
      }
    },
    created() {
      this.$http.get(WS_PRODUCTS)
        .then((res)=>{
          this.products = res.body;
          // console.log(res);
          // console.log(JSON.stringify(res.body[0]));
        })
        .catch((err)=>{
          console.log(err);
        });
    },
    watch: {
      // orderCol: function(val, oldVal){
      //   if (true) {
      //
      //   }
      // }
    },

    computed: {
      finalPrice() {
        let result = this.productInfo.dealerProductPrice;
        // applay markup
        if (this.productInfo.storeProductMarkup > 0) {
          result *= (1 + (this.productInfo.storeProductMarkup / 100));
        }
        return result;
      },
      finalPriceDiscount() {
        let result = this.productInfo.dealerProductPrice;
        // applay markup
        if (this.productInfo.storeProductMarkup > 0) {
          result *= (1 + (this.productInfo.storeProductMarkup / 100));
        }
        // applay discount
        if (this.productInfo.storeProductDiscountEnable && this.productInfo.storeProductDiscount > 0) {
          result -= this.productInfo.storeProductDiscount;
        }
        return result;
      }
    },

    methods: {
      // select which col to order
      selectColOrder(col){
        // same col, change cres/decr
        if (col === this.orderCol) {
          this.order = this.order * -1;
          console.log(this.order);
        }
        // change col to order
        else {
          this.orderCol = col;
          this.order = 1;
        }
      },
      // Get next picture url.
      changePic(){
        this.picId++;
        // max picId.
        if (this.picId > 6) {
          this.picId = 1;
        }
      },
      openInfo(product){
        // console.time('openInfo');
        // Reset picture url number.
        this.picId = 1;
        // Get product from array.
        this.productInfo = product;
        // console.timeEnd('openInfo');
        // Set input value.
        this.inputChangIdStore = this.productInfo.idStore;
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
        return accounting.formatMoney(value, 'R$', 2, '.', ',');
      }
    },

    directives: {

    },
    http: {
      // root: '/root'
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
