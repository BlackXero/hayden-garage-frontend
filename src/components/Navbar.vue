<template>

  <nav class="navbar navbar-expand-lg bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand text-white" to="/">Hayden Garage</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link text-white" to="/">Home</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link text-white" to="/booking-slots">Booking Slots</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link text-white" to="/add-booking">Add Booking</router-link>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <button type="button" class="btn btn-light" @click="logout" v-if="isLoggedIn">Logout</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState,mapActions } from "vuex";
export default {
  computed:{
    ...mapState(['isLoggedIn'])
  },
  methods:{
    ...mapActions(['logout'])
  },
  created() {
  }
}

</script>