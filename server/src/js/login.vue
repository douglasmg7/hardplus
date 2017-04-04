<template lang='pug'>
  div
    //- .ui.black.inverted.attached.stackable.menu
    .ui.black.inverted.borderless.attached.stackable.menu
      .ui.container
        a.ui.link.item(href='/')
          i.big.home.icon Zunka
    //- .ui.center.aligned.container
    .ui.left.aligned.container
      .ui.basic.padded.segment
        //- form.ui.form
        .ui.basic.segment
          //- detalhes
          h3.ui.dividing.header Login
          .field
            label E-mail
            input(v-model='email')
          .field
            label Senha
            input(v-model='password')
          .field
            button.ui.positive.button(@click='login(email, password)') Logar
            button.ui.positive.button(@click='signUp(email, password)') Criar conta
</template>
<script>
  /* globals accounting */
  'use strict';
  export default {
    components: {
    },
    data: function(){
      return {
        email:'',
        password: ''
      }
    },
    created() {
    },
    methods: {
      // retrive products page
      login(email, password){
        this.$http.post(`login`, {email: email, password: password})
          .then(res=>{
            console.log(res.body);
            console.log(res.body.token);
            // sessionStorage.setItem('token', res.body.token);
            if (res.body.success) {
              sessionStorage.token = res.body.token
            } else {
              delete sessionStorage.token;
            }
          })
          .catch(err=>{
            console.log(`Error - login, err: ${JSON.stringify(err)}`);
          });
      },
      signUp(email, password){
        this.$http.post(`sign-up`, {email: email, password: password})
          .then((res)=>{
            console.log(res.body);
            console.log(res.email);
            console.log(res.password);
          })
          .catch((err)=>{
            console.log(`Error - login(), err: ${err}`);
          });
      }
    }
  }
</script>
<style lang='stylus'>
</style>
