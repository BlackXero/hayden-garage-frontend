<template>
  <div class="row justify-content-center">
    <div class="col-sm-12 col-md-12 col-lg-7">
      <div class="card mt-5">
        <div class="card-header bg-dark text-white">
          <h3>Login</h3>
        </div>
        <div class="card-body">
          <form>
            <div class="mb-3" v-if="hasError">
              <div class="text-danger" v-html="errorString"></div>
            </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email address</label>
              <input type="email" v-model="email" :class="invalid" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Password</label>
              <input type="password" v-model="password" :class="invalid" id="exampleInputPassword1">
            </div>
            <button type="button" @click="login" class="btn btn-dark float-end">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
export default {
  data() {
    return {
      email:"",
      password:"",
      hasError:false,
      invalid:"form-control",
      errorString:""
    }
  },
  methods:{
    async login(){
      try{
        this.invalid = 'form-control';
        this.hasError = false;
        const response = await axios.post("/login", {
          email: this.email,
          password: this.password
        });
        if(response.data.data.token){
          localStorage.setItem('token',response.data.data.token);
        }
        this.$store.commit('LOGIN');
        this.$router.push('/');
      }catch(error){
        if(error.response.status === 401){
          this.invalid = 'form-control is-invalid';
          this.$swal('Login credentials invalid.');
        }
        if(error.response.status === 422){
          this.invalid = 'form-control is-invalid';
          let str = '';
          for(let i in error.response.data.errors){
            for(let v in error.response.data.errors[i]){
              str += '<p>'+ error.response.data.errors[i][v] +'</p>';
            }
          }
          this.hasError = true;
          this.errorString = str;
        }
      }
    }
  }
}
</script>