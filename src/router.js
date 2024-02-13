import { createRouter, createWebHistory } from "vue-router";

import Login from './components/Auth/Login.vue';
import Home from './components/Home.vue'
import BookingSlots from './components/BookingSlots.vue'
import AddBooking from './components/AddBooking.vue'

//Routes array with matching components
const routes = [
    {
        path:'/',
        component:Home,
        name:'Home',
        meta:{public: false}
    },
    {
        path:'/add-booking',
        component:AddBooking,
        name:'AddBooking',
        meta:{public: false}
    },
    {
        path:'/booking-slots',
        component:BookingSlots,
        name:'BookingSlots',
        meta:{public: false}
    },
    {
        path:'/booking-slots',
        component:BookingSlots,
        name:'BookingSlots',
        meta:{public: false}
    },
    {
        path:'/login',
        component:Login,
        name:'Login',
        meta:{public: true}
    }
];

const router = createRouter({
    history:createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    if(!to.meta.public && !isAuthenticated){
        next({name: 'Login'});
    }else{
        next();
    }
});

export default router;