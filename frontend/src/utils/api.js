import axios from 'axios';

const api = axios.create({
  baseURL: 'https://portfolio-tracker-backend-keer.onrender.com/api',
});

export default api;
