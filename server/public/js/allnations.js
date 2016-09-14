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
      products: []
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
          console.log(res);
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
    },

    directives: {

    },
    http: {
      // root: '/root'
    }
  });
})(window);
