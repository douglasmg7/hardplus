<template lang='pug'>
  div
    .ui.small.modal
      i.close.icon
      .header {{product.storeProductTitle}}
      .content
        form.ui.form
          .ui.segment
            //- detalhes
            h3.ui.dividing.header Detalhes
            .field
              label Hard Plus Id
              input(v-model='product.storeProductId')
            .field
              label Título
              input(v-model='product.storeProductTitle')
            .field
              label Título fornecedor
              input.ui.disabled.input(v-model='product.dealerProductTitle')
            .field
              label Imagem
              input(type='file')
              //- button Carregar imagens do fornecedor
              button.ui.button(@click='loadDealerImages(product)') Carregar imagens do fornecedor
            .field
              label Descrição primária
              textarea(v-model='product.storeProductDescPrimary' rows='15')
            .field
              label Descrição completa
              textarea(v-model='product.storeProductDescComplete' rows='15')
            .two.fields
              //- maker
              .field
                label Fabricante
                select.ui.search.dropdown(v-model='product.storeProductMaker')
                  input(v-model='product.storeProductMaker' type='hidden')
                  option(v-for='maker in productMakers', :value='maker.name') {{maker.value}}
              .field
                label Categoria
                select.ui.search.dropdown(v-model='product.storeProductCategory')
                  input(v-model='product.storeProductCategory' type='hidden')
                  option(v-for='category in productCategories', :value='category.name') {{category.value}}
          //- warranty
          .ui.segment
            h3.ui.dividing.header Garantia
            .fields
              .four.wide.field
                label Fornecedor
                .ui.right.labeled.disabled.input
                  input(v-model='product.dealerProductWarrantyDays')
                  .ui.label.basic Dias
              .four.wide.field
                label Loja
                .ui.right.labeled.input
                  input(v-model='product.storeProductWarrantyDays')
                  .ui.label.basic Dias
              .eight.wide.field
                label Observação
                input(v-model='product.storeProductWarrantyDetail')
          //- price
          .ui.segment
            h3.ui.dividing.header Preço
            .field
              .ui.checkbox
                input(type='checkbox' v-model='product.storeProductDiscountEnable')
                label Habilitar desconto
            .fields
              .four.wide.field
                label Fornecedor
                .ui.labeled.disabled.input
                  .ui.label.basic R$
                  input(v-model='product.dealerProductPrice')
              .four.wide.field
                label Lucro
                .ui.right.labeled.input
                  input(v-model='product.storeProductMarkup')
                  .ui.label.basic %
              .four.wide.field
                label Desconto
                .ui.action.input
                  input(v-model='product.storeProductDiscountValue')
                  select.ui.compact.selection.dropdown(v-model='product.storeProductDiscountType')
                    input(v-model='product.storeProductDiscountType' type='hidden')
                    option(value='%') %
                    option(value='R$') R$
              .four.wide.field
                label Loja
                .ui.labeled.disabled.input
                  .ui.label.basic R$
                  input(v-model='finalPrice')
          //- status
          .ui.segment
            h3.ui.dividing.header Status
            .field
              .ui.checkbox
                input(type='checkbox' v-model='product.storeProductCommercialize')
                Label Comercializar produto
            .fields
              .one.wide.field
              .six.wide.field
                label Estoque
                .ui.small.visible.aligned.center.message(v-bind:class='{"warning": product.dealerProductQtd < 5}')
                  .ui.center.aligned.container
                    p {{product.dealerProductQtd}} {{product.dealerProductQtd > 1 ? 'unidades': 'unidade'}}
              .two.wide.field
              .six.wide.field
                label Status fornecedor
                .ui.small.visible.message(v-bind:class='{"warning": !product.dealerProductActive}')
                  .ui.center.aligned.container
                    p {{product.dealerProductActive == true ? 'Produto ativo' : 'Produto inativo'}}
      .actions
        button.ui.positive.button(@click='saveProduct(product)') Salvar
        button.ui.black.deny.button Fechar
</template>
<script>
  'use strict';
  import accounting from 'accounting';
  import wsPath from '../../bin/wsPath';
  // initialize
  $(document).ready(function(){
    // // initialize dropdown
    // $('.ui.dropdown')
    //   .dropdown({duration: 0});
    $('.ui.form').form({
      onSuccess: function (event, fields) {
        event.preventDefault();
      }
    })
  });
  export default {
    data: function(){
      return { msg: 'Products Detail Store' };
    },
    props:['product', 'productMakers', 'productCategories'],
    filters: { currencyBr(value){ return accounting.formatMoney(value, "R$ ", 2, ".", ","); }
    },
    methods: {
      saveProduct(product){
        this.$http.put(`${wsPath.store}/${product._id}`, product)
          .then((res)=>{
            this.$emit('save');
          })
          .catch((err)=>{
            alert(`error: ${JSON.stringify(err)}`);
            console.log(`err: ${JSON.stringify(err)}`);
          });
      },
      loadDealerImages(product){
        this.$http.put(`${wsPath.allNations}/download-dealer-images/${product._id}`)
          .then(()=>{
          })
          .catch(err=>{
            alert(`error: ${JSON.stringify(err)}`);
            console.log(`err: ${JSON.stringify(err)}`);
          })
      }
    },
    computed: {
      finalPrice() {
        let result = this.product.dealerProductPrice;
        // apply markup
        if (this.product.storeProductMarkup > 0) {
          result *= (1 + (this.product.storeProductMarkup / 100));
        }
        // apply discount
        if (this.product.storeProductDiscountEnable){
          // by value
          if ('R$' === this.product.storeProductDiscountType) {
            result -= this.product.storeProductDiscountValue;
          // by percentage
          } else {
            result -= result * (this.product.storeProductDiscountValue / 100);
          }
        }
        this.product.storeProductPrice = result;
        return accounting.formatMoney(result, '', 2, '.', ',');
      },
    }
  }
</script>
<style lang='stylus'>
</style>
