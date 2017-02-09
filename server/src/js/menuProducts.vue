<template lang='pug'>
  .ui.menu
    a.item(href='_store' v-bind:class='{"active": active === "store"}') Hard Plus
    a.item(href='_allnations' v-bind:class='{"active": active === "allNations"}') All Nations
    a.item(href='lojasamericanas' v-bind:class='{"active": active === "lojasAmericanas"}') Lojas Americanas
</template>

<script>
  'use strict';
  export default {
    data: function(){
      return {
        msg: 'Menu Products'
      }
    },
    props: [
      'active'
    ],
    created() {
    }
  }
</script>

<style lang='stylus'>

</style>
