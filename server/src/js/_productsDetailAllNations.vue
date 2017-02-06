<template lang='pug'>
  div
    .ui.small.modal
      i.close.icon
      .header {{product.desc}}
      .content
        table.ui.compact.striped.table
          tbody
            tr
              td Id All Nations
              td {{product.code}}
            tr
              td Id Loja
              td {{product.storeProductId ? product.storeProductId : ' - '}}
            tr
              td Localização
              td {{product.stockLocation}}
            tr
              td Última atualização
              td {{product.ts}}
            tr
              td Imagem
              td
                .image
                  img(v-if="product.urlImg" @click="changePic()" v-bind:src="product.urlImg + '-0' + picId" v-bind:alt="product.desc")
            tr
              td Descrição
              td {{product.tecDesc}}
        //- .ui.big.very.relaxed.list
        .ui.divided.items
          .item
            .content
              .header Id All Nations
              .description {{product.code}}

          .item
            .content
              .header Id Loja
              .description {{product.storeProductId ? product.storeProductId : ' - '}}
          .item
            .content
              .header Localização
              .description {{product.stockLocation}}
          .item
            .content
              .header Última atualização
              .description {{product.ts}}
          .item
            .content
              .header Ativo
              .description {{product.active ? 'Ativo' : 'Inativo'}}
          .item
            .content
              .header Disponibilidade
              .description {{product.available ? 'Disponível' : 'Indisponível'}}
          .item
            .content
              .header Estoque
              .description {{product.stockQtd}}
          .item
            .content
              .header Preço
              .description {{product.price}}
              //- .description {{product.price | currencyBr}}
          .item
            .content
              .header Descrição
              .description {{product.tecDesc}}
          .item
            .content
              .header Departamento
              .description {{product.department}}
          .item
            .content
              .header Categoria
              .description {{product.category}}
          .item
            .content
              .header Sub-categoria
              .description {{product.subCategory}}
          .item
            .content
              .header Fabricante
              .description {{product.manufacturer}}
          .item
            .content
              .header Número do produto
              .description {{product.partNum}}
          .item
            .content
              .header EAN
              .description {{product.ean}}
          .item
            .content
              .header Garantia
              .description {{product.warranty}}
          .item
            .content
              .header Peso
              .description {{product.weight}}kg
          .item
            .content
              .header Largura
              .description {{product.width}}cm
          .item
            .content
              .header Altura
              .description {{product.height}}cm
          .item
            .content
              .header Profundidade
              .description {{product.deep}}cm
          .item
            .content
              .header Imagem
              .description
                .image
                  img(v-if="product.urlImg" @click="changePic()" v-bind:src="product.urlImg + '-0' + picId" v-bind:alt="product.desc")
          .item
            .content
              .header NCM
              .description {{product.ncm}}
          .item
            .content
              .header Imposto
              .description {{product.taxReplace ? 'Incide ICMS ST' : 'Não incide ICMS ST'}}
          .item
            .content
              .header Origem
              .description {{product.origin}}
      .actions
        .ui.black.cancel.button Fechar
        .ui.positive.button Salvar
</template>
<script>
  'use strict';
  export default {
    data: function(){
      return {
        // Each produtc can have one o more pictures url.
        picId: 1
      }
    },
    props:[
      'product'
    ],
    methods: {
      // Get next picture url.
      changePic(){
        this.picId++;
        // max picId.
        if (this.picId > 6) {
          this.picId = 1;
        }
      }
    }
  }
</script>
<style lang='stylus'>
  /*comercialized but not available or not active*/
  tr.market
    background-color: #F2DEDE
  /*comercialized and available and active*/
  tr.market.available-prd.active-prd.stock-prd
    background-color: #bdffbd
</style>
