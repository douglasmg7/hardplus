/* globals  */
'use strict';

let vue = require('vue');
let vueResource = require('vue-resource');

const WS_PRODUCTS = '/ws/products';

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
      inputChangIdStore: '',
      // actived menu
      menuIsActive: {
        allNations: false,
        store: true
      }
    },

    created() {
      this.$http.get(WS_PRODUCTS)
        .then((res)=>{
          this.products = res.body;
          // console.log(res);
          // console.log(JSON.stringify(res.body[0]));
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
        // console.time('openInfo');
        // Reset picture url number.
        this.picId = 1;
        // Get product from array.
        this.productInfo = product;
        // console.timeEnd('openInfo');
        // Set input value.
        this.inputChangIdStore = this.productInfo.idStore;
      },
      saveProductStore(product, opt){
        opt.commercialize = opt.commercialize === undefined ? product.commercialize: opt.commercialize;
        // must have store product id when commercialize
        if (opt.commercialize) {
          opt.storeProductId = opt.storeProductId ? opt.storeProductId: product._id;
        }
        console.log(`setCommercialize: storeProductId: ${opt.storeProductId}, commercialize: ${opt.commercialize}`);
        this.$http.put(`${WS_PRODUCTS}/${product._id}`, {'commercialize': opt.commercialize, 'storeProductId': opt.storeProductId})
          .then((res)=>{
            // not could process params
            if (res.body.err) {
              alert(`erro: ${res.body.err}`);
            }
            // data modifed
            else if (res.body.modifiedCount && (res.body.modifiedCount > 0)){
              // update product
              product.commercialize = opt.commercialize;
              product.storeProductId = opt.storeProductId;
              this.inputStoreProductId = opt.storeProductId;
            }
            else {
              alert(`Não foi possível fazer a alteração da comerialização.`);
            }
          })
          .catch((err)=>{
            alert(`error: ${JSON.stringify(err)}`);
            console.log(`err: ${JSON.stringify(err)}`);
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
