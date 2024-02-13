import axios from "axios";


const token = 'Bearer '+ localStorage.getItem('token');

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers:{
        'Authorization': token
    }
});

export default instance;