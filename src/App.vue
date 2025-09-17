<template>
  <div class="app">
    <HeaderNavigation class="header" @navigate="x => navigate(x)" />
    <Home v-if="view == 'Home'" />
    <Calendar v-else-if="view == 'Calendar'" />
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
      view: "Home"
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
