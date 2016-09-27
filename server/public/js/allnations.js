/* globals  */
'use strict';

let vue = require('vue');
let vueResource = require('vue-resource');

vue.use(vueResource);

(function(exports){
  exports.app = new vue({
    el: '#products',

    data: {
      // product: {},
      // All products.
      products: [
        {desc:''}
      ],
      productInfo: {},
      // Which column to order.
      orderCol: 'desc',
      // Crescent o decrescent order.
      order: 1,
      // Used by the text filter.
      filterName: '',
      // Each produtc can have one o more pictures url.
      picId: 1,
      inputChangIdStore: ''
    },

    created() {
      this.$http.get('/allnations/')
        .then((res)=>{
          this.products = res.body;
          // console.log(res);
          // console.log(typeof res.body[0].available);
        })
        .catch((err)=>{
          console.log(err);
        });
    },

    watch: {
      // orderCol: function(val, oldVal){
      //   if (true) {
      //
      //   }
      // }
    },

    computed: {
    },

    methods: {
      // select which col to order
      selectColOrder(col){
        // same col, change cres/decr
        if (col === this.orderCol) {
          this.order = this.order * -1;
          console.log(this.order);
        }
        // change col to order
        else {
          this.orderCol = col;
          this.order = 1;
        }
      },
      // Get next picture url.
      changePic(){
        this.picId++;
        // max picId.
        if (this.picId > 6) {
          this.picId = 1;
        }
      },
      openInfo(product){
        console.time('openInfo');
        // Reset picture url number.
        this.picId = 1;
        // Get product from array.
        this.productInfo = product;
        console.timeEnd('openInfo');
        // Set input value.
        this.inputChangIdStore = this.productInfo.idStore;
      },
      setCommercialize(product, commercialize, idStore){
        commercialize = commercialize ? true: false;
        idStore = idStore || '';
        console.log(`product _id: ${product._id}`);
        console.log(`commercialize: ${commercialize}`);
        console.log(`idStore: ${idStore}`);
        this.setProductMarket(product, commercialize);
        if (idStore) {
          this.setProductIdStore(product, idStore);
        }
      },
      // Update product comercialization.
      setProductMarket(product, commercialize){
        commercialize = commercialize ? true: false;
        console.log('setProductMarket');
        console.log(`product _id: ${product._id}`);
        console.log(`commercialize: ${commercialize}`);
        this.$http.put(`/allnations/${product._id}`, {'market': commercialize})
          .then((res)=>{
            // Not could process params.
            if (res.body.err) {
              alert(`erro: ${res.body.err}`);
            }
            // Data modifed.
            else if (res.body.modifiedCount && (res.body.modifiedCount > 0)){
              // Update product.
              product.market = commercialize;
              // this.products.find(function(o){return o._id === _id;}).market = val;
              // console.log(`update - ${_id} - ${val}`);
            }
            else {
              alert(`Não foi possível fazer a alteração da comerialização.`);
            }
          })
          .catch((err)=>{
            alert(`error: ${JSON.stringify(err)}`);
            console.log(`err: ${JSON.stringify(err)}`);
          });
      },
      // Change id that product to refere.
      setProductIdStore(product, idStore){
        idStore = idStore || '';
        console.log('setProductIdStore');
        console.log(`product _id: ${product._id}`);
        console.log(`idStore: ${idStore}`);
        this.$http.put(`/allnations/${product._id}`, {'idStore': idStore})
          .then((res)=>{
            // Not could process params.
            if (res.body.err) {
              alert(`erro: ${res.body.err}`);
            }
            // Data modifed.
            else if (res.body.modifiedCount && (res.body.modifiedCount > 0)){
              // Update product id to reference.
              // this.products.find(function(o){return o._id === _id;}).idStore = idStore;
              product.idStore = idStore;
            }
          })
          .catch((err)=>{
            alert(`error: ${JSON.stringify(err)}`);
          });
      }
    },

    directives: {

    },
    http: {
      // root: '/root'
    }
  });
})(window);
