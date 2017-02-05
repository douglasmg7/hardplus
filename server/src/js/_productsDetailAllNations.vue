<template lang='pug'>
  div
    .ui.small.modal
      i.close.icon
      .header Produto A
      //- .header {{productDetail.desc}}
      .content
        form.ui.form
          .field
            label Id AllNations
            input()
      .actions
        .ui.black.cancel.button Fechar
        .ui.positive.button Salvar
</template>
<script>
  'use strict';
  export default {
    data: function(){
      return {

      }
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
