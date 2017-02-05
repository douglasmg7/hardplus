<template lang='pug'>
  .ui.menu
    a.item.active(href="_store") Hard Plus
    a.item(href='_allnations') All Nations
    a.item(href='lojasamericanas') Lojas Americanas
</template>

<script>
  'use strict';
  export default {
    data: function(){
      return {
        msg: 'Menu Products'
      }
    },
    created() {
    }
  }
</script>

<style lang='stylus'>

</style>
