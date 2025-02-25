import axios from 'axios';


const API_BASE_URL = 'https://myapiii.azurewebsites.net/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})


export default apiClient