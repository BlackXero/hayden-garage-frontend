<template>
  <Navbar />
  <div class="container">
    <vue3-progress />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  name:'App',
  mounted() {
    this.$progress.finish();
  },
  created() {
    this.$progress.start();
    this.$router.beforeEach((to, from, next) => {
      this.$progress.start();
      next();
    });

    this.$router.afterEach((to, from) => {
      this.$progress.finish();
    });
  }
}
</script>

<style>

</style>
