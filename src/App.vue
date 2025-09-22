<template>
  <div class="app">
    <HeaderNavigation 
      class="header" 
      @navigate="navigate" 
      @user-changed="handleUserChanged" 
    />
    <Home 
      v-if="view == 'Home'" 
      :user="currentUser" 
    />
    <Calendar 
      v-else-if="view == 'Calendar'" 
      :user="currentUser" 
    />
  </div>
</template>

<script>
import HeaderNavigation from './components/HeaderNavigation.vue';
import Calendar from './Views/Calendar.vue';
import Home from './Views/Home.vue';

export default {
  name: 'App',
  data() {
    return {
      view: "Home",
      currentUser: null
    }
  },
  components: {
    HeaderNavigation,
    Home,
    Calendar
  },
  methods: {
    navigate(to) {
      this.view = to;
    },
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