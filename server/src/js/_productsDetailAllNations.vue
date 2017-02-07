<template lang='pug'>
  div
    .ui.small.modal
      i.close.icon
      .header {{product.desc}}
      .content
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
              td Imagem
              td
                .ui.tiny.images(v-if='product.urlImg')
                  - for(var i=1; i<5; i++)
                    img(v-bind:src='product.urlImg + "-0"' + '+' + i)
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
  // $('document').ready(function(){
  //   console.log('document-load');
  //   console.log('Número de imgs: ' + $('img').length);
  //   $('img').on('load', function () {
  //     console.log('image-load');
  //   });
  // });
  export default {
    data: function(){
      return {
        msg: 'Products Detail All Nations'
      }
    },
    props:[
      'product'
    ],
    filters: {
      currencyBr(value){
        // return accounting.formatMoney(value, "R$", 2, ".", ",");
      }
    }
  }
</script>
<style lang='stylus'>
</style>
