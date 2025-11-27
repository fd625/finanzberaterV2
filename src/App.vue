<template>
  <div class="app">
    <HeaderNavigation 
      class="header"
    />
    <RouterView></RouterView>
  </div>
</template>

<script>
import HeaderNavigation from './components/HeaderNavigation.vue';

export default {
  name: 'App',
  components: {
    HeaderNavigation,
  },
}
</script>

<style scoped>
.app {
  height: 100%;
}
.header {
  height: 100px; 
  width: 100%;
  box-shadow: 0px 2px 7px #d3d3d3;
}
</style>