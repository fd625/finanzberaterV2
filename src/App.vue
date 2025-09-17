<template>
  <div class="app">
    <HeaderNav class="header"/>
  </div>
</template>

<script>
import HeaderNav from './components/HeaderNav.vue';

export default {
  name: 'App',
  data() {
    return {
      
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style scoped>
.app {
  height: 100%;
}
.header {
  height: 100px; 
  width: 100% 
}
</style>
