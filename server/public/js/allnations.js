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
      picId: 1
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
        if (this.picId > 5) {
          this.picId = 1;
        }
        // console.log(this.picId);
      },
      // Open modal product info.
      openInfo(event){
        // Reset picture url number.
        this.picId = 1;
        // Get product from array.
        this.productInfo = this.products.find(function(o){return o.code === event.target.dataset.code;});
        // console.log(`code: ${this.productInfo.code}\ndesc: ${this.productInfo.desc}`);
      },
      // Update product comercialization.
      updateMarket(_id, val){
        // console.log(`_id: ${_id}, val: ${val}`);
        this.$http.put(`/allnations/${_id}`, {'market': val})
          .then((res)=>{
            // Not could process params.
            if (res.body.err) {
              alert(`erro: ${res.body.err}`);
            }
            // this.products = res.body;
            console.log(res.body);
            // console.log(typeof res.body[0].available);
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
