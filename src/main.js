import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Vue3Progress from "vue3-progress";


const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);
app.use(store);
app.use(router);
app.use(VueSweetalert2);
app.use(Vue3Progress,{
    position: "fixed",
    height: "4px",
});

app.mount('#app')
