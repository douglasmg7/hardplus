/* globals accounting */
'use strict';

let vue = require('vue');
let vueResource = require('vue-resource');
// let veeValidate = require('vee-validate');

const WS_PRODUCTS = '/ws/products';

vue.use(vueResource);


// const config = {
//   errorBagName: 'errors', // change if property conflicts.
//   delay: 0,
//   locale: 'en',
//   messages: null,
//   strict: true
// };
// vue.use(veeValidate, config);


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
      // onlyNumber(event){
      //   if (event.key === '2') {
      //     alert('second');
      //     return false;
      //   } else{
      //     alert('other');
      //     return true;
      //   }
      //   return (
      //     event.ctrlKey ||
      //     event.altKey ||
      //     (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) ||
      //     (95<event.keyCode && event.keyCode<106) ||
      //     (event.keyCode==8) || (event.keyCode==9) ||
      //     (event.keyCode>34 && event.keyCode<40) ||
      //     (event.keyCode==46)
      //   );
      // }

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
