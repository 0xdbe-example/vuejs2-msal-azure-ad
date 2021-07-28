<template>
  <div class="redirect">
    <h1>Redirect</h1>
 </div>
</template>

<script>

  export default {
    name: 'Redirect',

    created(){
      this.$msal.handleRedirect();
    }

  }

</script>