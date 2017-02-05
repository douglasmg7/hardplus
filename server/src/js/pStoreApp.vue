<template lang='pug'>
  div
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
    .ui.small.modal
      i.close.icon
      .header {{productDetail.dealerProductTitle}}
      .content
        form.ui.form
          .field
            label Título
            input(v-model='productDetail.storeProductTitle ? productDetail.storeProductTitle : productDetail.dealerProductTitle')
          .field
            label Imagem
            input(type='file')
          .field
            label Descrição primária
            textarea(v-model='productDetail.storeProductDescPrimary ? productDetail.storeProductDescPrimary : productDetail.dealerProductDesc' rows='2')
          .field
            label Descrição completa
            textarea(v-model='productDetail.storeProductDescComplete ? productDetail.storeProductDescComplete : productDetail.dealerProductDesc' rows='3')
          .two.fields
            .field
              label Fabricante
              input(v-model='productDetail.storeProductMaker')
            .field
              label Categoria
              input(v-model='productDetail.storeProductCategory')
          .two.fields
            .field
              label Garantia
              .ui.right.labeled.input
                input(v-model='productDetail.storeProductWarrantyDays')
                .ui.label.basic Dias
            .field
              label Garantia - observação
              input(v-model='productDetail.storeProductWarrantyDetail')
          .three.fields
            .field
              label Preço do fornecedor
              .ui.labeled.input
                .ui.label.basic R$
                input(v-model='productDetail.dealerProductPrice' readonly="")
            .field
              label Lucro
              .ui.right.labeled.input
                input(v-model='productDetail.dealerProductPrice')
                .ui.label.basic %
            .field
              label Desconto
              .ui.action.input
                input(v-model='productDetail.dealerProductPrice')
                select.ui.compact.selection.dropdown
                  option(value='%') %
                  option(value='R$') R$
          .one.fields
            .field
              .ui.checkbox
                input(type='checkbox' v-model='productDetail.storeProductDiscountEnable')
                label Habilitar desconto
          .three.fields
            .field
              label Preço final sem desconto
              .ui.labeled.input
                .ui.label.basic R$
                input(:value='finalPrice' readonly="")
            .field
              label Preço final com desconto
              .ui.labeled.input
                .ui.label.basic R$
                input(:value='finalPriceDiscount' readonly="")
            .field
              label Estoque
              input(v-model='productDetail.dealerProductQtd' readonly="")
          .field
            .ui.checkbox
              input(type='checkbox' v-model='productDetail.storeProductCommercialize')
              Label Comercializar produto
      .actions
        .ui.black.cancel.button Fechar
        .ui.positive.button Salvar
</template>

<script>
  /* globals accounting */
  'use strict';
  // let veeValidate = require('vee-validate');
  $(document).ready(function(){
    // initialize dropdown
    $('.ui.dropdown')
      .dropdown({duration: 0});
  });
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
        let result = this.productDetail.dealerProductPrice;
        // applay markup
        if (this.productDetail.storeProductMarkup > 0) {
          result *= (1 + (this.productDetail.storeProductMarkup / 100));
        }
        return result;
      },
      finalPriceDiscount() {
        let result = this.productDetail.dealerProductPrice;
        // applay markup
        if (this.productDetail.storeProductMarkup > 0) {
          result *= (1 + (this.productDetail.storeProductMarkup / 100));
        }
        // applay discount
        if (this.productDetail.storeProductDiscountEnable && this.productDetail.storeProductDiscount > 0) {
          result -= this.productDetail.storeProductDiscount;
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
