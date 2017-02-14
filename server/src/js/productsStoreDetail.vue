<template lang='pug'>
  div
    .ui.small.modal
      i.close.icon
      .header {{product.storeProductTitle}}
      .content
        form.ui.form
          .field
            label Título
            input(v-model='product.storeProductTitle')
          .field
            label Imagem
            input(type='file')
          .field
            label Descrição primária
            textarea(v-model='product.storeProductDescPrimary ? product.storeProductDescPrimary : product.dealerProductDesc' rows='2')
          .field
            label Descrição completa
            textarea(v-model='product.storeProductDescComplete ? product.storeProductDescComplete : product.dealerProductDesc' rows='3')
          .two.fields
            .field
              label Fabricante
              input(v-model='product.storeProductMaker')
            .field
              label Categoria
              input(v-model='product.storeProductCategory')
          .two.fields
            .field
              label Garantia
              .ui.right.labeled.input
                input(v-model='product.storeProductWarrantyDays')
                .ui.label.basic Dias
            .field
              label Garantia - observação
              input(v-model='product.storeProductWarrantyDetail')
          .three.fields
            .field
              label Preço do fornecedor
              .ui.labeled.input
                .ui.label.basic R$
                input(v-model='product.dealerProductPrice' readonly="")
            .field
              label Lucro
              .ui.right.labeled.input
                input(v-model='product.dealerProductPrice')
                .ui.label.basic %
            .field
              label Desconto
              .ui.action.input
                input(v-model='product.dealerProductPrice')
                select.ui.compact.selection.dropdown
                  option(value='%') %
                  option(value='R$') R$
          .one.fields
            .field
              .ui.checkbox
                input(type='checkbox' v-model='product.storeProductDiscountEnable')
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
              input(v-model='product.dealerProductQtd' readonly="")
          .field
            .ui.checkbox
              input(type='checkbox' v-model='product.storeProductCommercialize')
              Label Comercializar produto
      .actions
        button.ui.positive.button(@click='saveProduct(product)') Salvar
        button.ui.black.deny.button Fechar
</template>
<script>
  'use strict';
  const WS_STORE = '/ws/store';
  import accounting from 'accounting';
  export default {
    data: function(){
      return { msg: 'Products Detail Store' };
    },
    props:['product'],
    filters: { currencyBr(value){ return accounting.formatMoney(value, "R$ ", 2, ".", ","); }
    },
    methods: {
      setCommercialize(product, commercialize){
        commercialize = commercialize === true ? true : false;
        console.log(`setCommercialize -> _id: ${product._id}, commercialize: ${commercialize}`);
        this.$http.put(`${WS_STORE}/set-commercialize/${product._id}`, {commercialize: commercialize})
          .then((res)=>{
            // error
            if (res.body.err) {
              alert(`erro: ${res.body.err}`);
            }
            // success
            else if (res.body.status && res.body.status === 'success'){
              // update product
              product.commercialize = commercialize;
            }
            else {
              alert(`Não foi possível comercializar o produto _id: ${product._id}.`);
            }
          })
          .catch((err)=>{
            alert(`error: ${JSON.stringify(err)}`);
            console.log(`err: ${JSON.stringify(err)}`);
          });
      },
      saveProduct(product){
        this.$http.put(`${WS_STORE}/${product._id}`, product)
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
    computed: {
      warranty_month() {
        if(this.product.warranty === 0){
          return 'Sem garantia';
        } else if(this.product.warranty === 1){
          return '1 mes';
        } else{
          return this.product.warranty + ' meses';
        }
      },
      finalPrice() {
        let result = this.product.dealerProductPrice;
        // applay markup
        if (this.product.storeProductMarkup > 0) {
          result *= (1 + (this.product.storeProductMarkup / 100));
        }
        return result;
      },
      finalPriceDiscount() {
        let result = this.product.dealerProductPrice;
        // applay markup
        if (this.product.storeProductMarkup > 0) {
          result *= (1 + (this.product.storeProductMarkup / 100));
        }
        // applay discount
        if (this.product.storeProductDiscountEnable && this.product.storeProductDiscount > 0) {
          result -= this.product.storeProductDiscount;
        }
        return result;
      }
    },
  }
</script>
<style lang='stylus'>
</style>
