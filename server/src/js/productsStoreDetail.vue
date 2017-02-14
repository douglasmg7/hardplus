<template lang='pug'>
  div
    .ui.small.modal
      i.close.icon
      .header {{product.storeProductTitle}}
      .content
        form.ui.form
          .ui.raised.segment
            h3.ui.horizontal.divider Detalhes
            .field
              label Hard Plus Id
              input(v-model='product.storeProductId')
            .field
              label Título
              input(v-model='product.storeProductTitle')
            .field
              label Imagem
              input(type='file')
            .field
              label Descrição primária
              textarea(v-model='product.storeProductDescPrimary' rows='2')
            .field
              label Descrição completa
              textarea(v-model='product.storeProductDescComplete' rows='3')
            .two.fields
              .field
                label Fabricante
                input(v-model='product.storeProductMaker')
              .field
                label Categoria
                input(v-model='product.storeProductCategory')
          .ui.segment
            h3.ui.header Garantia
            .ui.section.divider
            .three.fields
              .field
                label Fornecedor
                .ui.large.label
                   p {{product.dealerProductWarrantyDays}} dias
              .field
                label Loja
                .ui.right.labeled.input
                  input(v-model='product.storeProductWarrantyDays')
                  .ui.label.basic Dias
              .field
                label Observação
                input(v-model='product.storeProductWarrantyDetail')
          .ui.segment
            h3.ui.header Preço
            .ui.section.divider
            .field
              .ui.checkbox
                input(type='checkbox' v-model='product.storeProductDiscountEnable')
                label Habilitar desconto
            .four.fields
              .field
                label Fornecedor
                .ui.large.label
                  p R$ {{product.dealerProductPrice}}
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
              .field
                label Loja
                .ui.large.label
                  p R$ {{finalPrice}}
          .ui.segment
            h3.ui.header Status
            .ui.section.divider
            .field
              .ui.checkbox
                input(type='checkbox' v-model='product.storeProductCommercialize')
                Label Comercializar produto
            .two.fields
              .field
                label Estoque
                .ui.large.label
                  p {{product.dealerProductQtd}} unidades
              .field
                label Status no fornecedor
                .ui.large.label
                  p {{product.dealerProductActive == true ? 'Produto ativo' : 'Produto inativo'}}
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
      saveProduct(product){
        this.$http.put(`${WS_STORE}/${product._id}`, product)
          .then((res)=>{
          })
          .catch((err)=>{
            alert(`error: ${JSON.stringify(err)}`);
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
