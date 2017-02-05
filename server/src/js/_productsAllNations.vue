<template lang='pug'>
  div
    table.ui.compact.striped.table
      thead
        tr
          // th.text-capitalize id
          th.clickable(@click="selectColOrder('desc')") Descrição
          th.clickable(@click="selectColOrder('stockQtd')") Estoque
          th.clickable(@click="selectColOrder('priceNum')") Preço
          th.clickable(@click="selectColOrder('available')") Disp
          th.clickable(@click="selectColOrder('id-store')") Id loja
      tbody
        tr(v-for="product in products")
          // td {{$index + 1}}
          td.clickable(@click="showProductDetail(product)" v-bind:data-code="product.code") {{product.desc}}
          td.clickable(@click="showProductDetail(product)") {{product.stockQtd}}
          td.clickable(@click="showProductDetail(product)") {{product.price}}
          //- td.clickable(@click="showProductDetail(product)") {{product.price | currencyBr}}
          td.clickable(@click="showProductDetail(product)") {{product.available && product.active ? 'Sim' : 'Não'}}
          td.clickable(@click="showProductDetail(product)") {{product.storeProductId ? product.storeProductId : ''}}
    //- .ui.small.modal
    //-   i.close.icon
    //-   .header {{productDetail.desc}}
    //-   .content
    //-     form.ui.form
    //-       .field
    //-         label Id AllNations
    //-         input(v-model='productDetail.code')
    //-   .actions
    //-     .ui.black.cancel.button Fechar
    //-     .ui.positive.button Salvar
</template>
<script>
  /* globals accounting */
  'use strict';
  // let veeValidate = require('vee-validate');
  // $(document).ready(function(){
  // });
  const WS_ALL_NATIONS = '/ws/allnations';
  export default {
    data: function(){
      return {
        // All products.
        products: [
          {desc:''}
        ],
        productDetail: {},
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
      this.$http.get(WS_ALL_NATIONS)
        .then((res)=>{
          this.products = res.body;
          // console.log(res);
          // console.log(JSON.stringify(res.body[0]));
        })
        .catch((err)=>{
          console.log(err);
        });
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
      showProductDetail(product){
        // console.time('openInfo');
        // Reset picture url number.
        this.picId = 1;
        // Get product from array.
        this.productDetail = product;
        // console.timeEnd('openInfo');
        // Set input value.
        this.inputChangIdStore = this.productDetail.idStore;
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
    }
    // filters: {
    //   currencyBr(value){
    //     return accounting.formatMoney(value, 'R$', 2, '.', ',');
    //   }
    // }
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
