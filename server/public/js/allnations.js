/* globals  */
'use strict';

let vue = require('vue');
let vueResource = require('vue-resource');

vue.use(vueResource);

(function(exports){
  exports.app = new vue({
    el: '#products',

    data: {
      test: 'Start',
      product: {},
      products: [
        {desc:''}
      ],
      orderCol: 'desc',
      order: 1,
      filterName: '',
      // each produtc can have one o more pictures url
      picId: 1
    },

    created() {
      // this.$http.get('/allnations/8')
      //   .then((res)=>{
      //     // this.test = res.body.code;
      //     // this.products.code = res.body.code;
      //     // this.products.desc = res.body.desc;
      //     this.products = res.body;
      //     console.log(res);
      //   })
      //   .catch((err)=>{
      //     console.log(err);
      //   });

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
      selectColOrder: function (col) {
        // same col, change cres/decr
        if (col === this.orderCol) {
          this.order = this.order * -1;
        }
        // change col to order
        else {
          this.orderCol = col;
          this.order = 1;
        }
      },
      // got to next picture url.
      changePic(){
        this.picId++;
        // max picId.
        if (this.picId > 5) {
          this.picId = 1;
        }
      },
      // point to the first picture url.
      resetPicId(){
        this.picId=1;
      }
    },

    directives: {

    },
    http: {
      // root: '/root'
    }
  });
})(window);
