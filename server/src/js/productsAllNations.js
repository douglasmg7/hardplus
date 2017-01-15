/* globals  accounting*/
'use strict';

let vue = require('vue');
let vueResource = require('vue-resource');

const WS_ALL_NATIONS = '/ws/allnations';

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
      inputStoreProductId: '',
      // actived menu
      menuIsActive: {
        allNations: true,
        store: false
      }
    },

    created() {
      this.$http.get(WS_ALL_NATIONS)
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
        // Reset picture url number.
        this.picId = 1;
        // Get product from array.
        this.productInfo = product;
        // Set input value.
        this.inputStoreProductId = this.productInfo.storeProductId;
      },
      setCommercialize(product, opt){
        opt.commercialize = opt.commercialize === undefined ? product.commercialize: opt.commercialize;
        // must have store product id when commercialize
        if (opt.commercialize) {
          opt.storeProductId = opt.storeProductId ? opt.storeProductId: product._id;
        }
        console.log(`setCommercialize: storeProductId: ${opt.storeProductId}, commercialize: ${opt.commercialize}`);
        this.$http.put(`${WS_ALL_NATIONS}/${product._id}`, {'commercialize': opt.commercialize, 'storeProductId': opt.storeProductId})
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

    filters: {
      currencyBr(value){
        return accounting.formatMoney(value, "R$", 2, ".", ",");
      }
    },

    directives: {

    },
    http: {
      // root: '/root'
    }
  });
})(window);
