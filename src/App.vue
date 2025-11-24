<template>
  <div class="app">
    <HeaderNavigation 
      class="header" 
      @user-changed="handleUserChanged" 
    />
    <RouterView></RouterView>
  </div>
</template>

<script>
import HeaderNavigation from './components/HeaderNavigation.vue';

export default {
  name: 'App',
  data() {
    return {
      currentUser: null
    }
  },
  components: {
    HeaderNavigation,
  },
  methods: {
    handleUserChanged(user) {
      console.log('User changed in App:', user);
      this.currentUser = user;
    }
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