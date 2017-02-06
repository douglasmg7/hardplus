<template lang='pug'>
  div
    .ui.small.modal
      i.close.icon
      .header {{product.desc}}
      .content
        //- table.ui.compact.striped.table
        table.ui.very.compact.striped.table
          tbody
            tr
              td Id All Nations
              td {{product.code}}
            tr
              td Id Loja
              td {{product.storeProductId ? product.storeProductId : ' - '}}
            tr
              td Última atualização
              td {{product.ts}}
            tr
              td Fabricante
              td {{product.manufacturer}}
            tr
              td Descrição
              td {{product.tecDesc}}
            tr
              td teste
              td
                - var n=0;
                  while n < 4
                    p= n++
            tr
              td Imagem
              td
                .ui.tiny.images(v-if='product.urlImg')
                  - for(var x=0; x<4; x++)
                    img(v-bind:src="product.urlImg + '-0' + picId")
                    //- img(v-bind:src="product.urlImg + '-0' + picId")
                //- img.ui.small.image(v-if="product.urlImg" @click="changePic()" v-bind:src="product.urlImg + '-0' + picId")
                //- img.ui.small.image(v-if="product.urlImg" @click="changePic()" v-bind:src="product.urlImg + '-0' + picId")
            tr
              td Disponibilidade
              td {{product.available ? 'Disponível' : 'Indisponível'}}
            tr
              td Ativo
              td {{product.active ? 'Ativo' : 'Inativo'}}
            tr
              td Estoque
              td {{product.stockQtd}}
            tr
              td Localização
              td {{product.stockLocation}}
            tr
              td Preço
              td {{product.price}}
              //- .description {{product.price | currencyBr}}
            tr
              td Departamento
              td {{product.department}}
            tr
              td Categoria
              td {{product.category}}
            tr
              td Sub-categoria
              td {{product.subCategory}}
            tr
              td Número do produto
              td {{product.partNum}}
            tr
              td EAN
              td {{product.ean}}
            tr
              td Garantia
              td {{product.warranty}}
            tr
              td Peso
              td {{product.weight}} kg
            tr
              td Largura
              td {{product.width}} cm
            tr
              td Altura
              td {{product.height}} cm
            tr
              td Profundidade
              td {{product.deep}} cm
            tr
              td NCM
              td {{product.ncm}}
            tr
              td Imposto
              td {{product.taxReplace ? 'Incide ICMS ST' : 'Não incide ICMS ST'}}
            tr
              td Origem
              td {{product.origin}}
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
