import axios from 'axios';
import { localStorageService } from '@/utils';
const instance = axios.create();

// Request interceptor
instance.interceptors.request.use(
    config => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNjRmMWExNWZiZjNkZTBkYTgxYTdhODA4IiwiaWF0IjoxNjk0Mjg0NTA2LCJleHAiOjE2OTQ3MTY1MDZ9.gaB9M1Qsx2aAd04laAIYEfma5m2VVP-kYf3iEKJM96E';//localStorageService.get('access_token');
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token
        }
        config.headers['Content-Type'] = 'application/json';
        return {...config,baseURL: process.env.API_URL,}
      },
      error => {
        Promise.reject(error)
      }
);

// Response interceptor
instance.interceptors.response.use(
  response => {
    // You can modify the response here
    // For example, transform the response data, handle certain statuses, etc.
    return response;
  },
  error => {
    // Handle response error
    const originalRequest = error.config

    if (
      error?.response?.status === 401 &&
      originalRequest.url === process.env.API_URL+'/refresh'
    ) {
      //router.push('/login')
      return Promise.reject(error)
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      //const refreshToken = localStorageService.getRefreshToken()
      const refreshToken = localStorageService.get('refresh_token')
      return axios
        .post(process.env.API_URL+'/refresh', {
          refresh_token: refreshToken ?? ''
        })
        .then(res => {
          if (res.status === 200) {
            localStorageService.set('access_token', res.data.access_token)
            axios.defaults.headers.common['Authorization'] =
              'Bearer ' + localStorageService.get('token')
            return axios(originalRequest)
          }
        }).catch(err => {
          console.error(err)
        });
    }
    return Promise.reject(error)
  }
);

export default instance;