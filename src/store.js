import { createStore } from "vuex";
import router from './router';
import axios from "@/axios";

export default createStore({
    state:{
        isLoggedIn: !!localStorage.getItem('token')
    },
    mutations:{
        LOGIN(state) {
            state.isLoggedIn = true
        },
        LOGOUT(state){
            state.isLoggedIn = false
        }
    },
    actions:{
        login({commit}){
            commit('LOGIN')
        },
        async logout({commit,dispatch}){
            commit('LOGOUT')
            localStorage.removeItem('token');
            dispatch('navigateToLogin')
        },
        navigateToLogin(){
            router.push({name: 'Login'})
        }
    }
})