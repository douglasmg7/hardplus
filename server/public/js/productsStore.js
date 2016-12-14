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
      finalPrice() {
        let result = this.productInfo.dealerProductPrice;
        // applay markup
        if (this.productInfo.storeProductMarkup > 0) {
          result *= (1 + (this.productInfo.storeProductMarkup / 100));
        }
        return result;
      },
      finalPriceDiscount() {
        let result = this.productInfo.dealerProductPrice;
        // applay markup
        if (this.productInfo.storeProductMarkup > 0) {
          result *= (1 + (this.productInfo.storeProductMarkup / 100));
        }
        // applay discount
        if (this.productInfo.storeProductDiscountEnable && this.productInfo.storeProductDiscount > 0) {
          result -= this.productInfo.storeProductDiscount;
        }
        return result;
      }      
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
      saveProductStore(product){
        this.$http.put(`${WS_PRODUCTS}/${product._id}`, product)
          .then((res)=>{
            // not could process params
            if (res.body.err) {
              alert(`erro: ${res.body.err}`);
            }
            // data modified
            else if (res.body.matchedCount && (res.body.matchedCount > 0)){
              console.log('Produto atualizado.');
            }
            else {
              alert(`Não foi possível fazer as alterações. result: ${JSON.stringify(res.body)}`);
            }
          })
          .catch((err)=>{
            alert(`erro: ${JSON.stringify(err)}`);
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
