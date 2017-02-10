<template lang='pug'>
  .ui.menu
    a.item(href='_store' v-bind:class='{"active": active === "store"}') Hard Plus
    a.item(href='_allnations' v-bind:class='{"active": active === "allNations"}') All Nations
    a.item(href='lojasamericanas' v-bind:class='{"active": active === "lojasAmericanas"}') Lojas Americanas
    .right.menu
      .item
        .ui.icon.input
          input(v-model='searchText' placeholder='Pesquisar')
          //- input(v-bind:value='value' v-on:input='updateValue($event.target.value)' placeholder='Pesquisar')
          i.search.link.icon(v-on:click='updateValue()')
</template>

<script>
  'use strict';
  export default {
    data: function(){
      return {
        msg: 'Menu Products',
        searchText: ''
      }
    },
    props: [
      'active'
    ],
    methods: {
      updateValue(){
        console.log('click');
        this.$emit('search', this.searchText);
      }
    }
  }
</script>

<style lang='stylus'>

</style>
