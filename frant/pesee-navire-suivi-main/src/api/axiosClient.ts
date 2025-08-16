import axios from 'axios';
import { getNewAccessToken } from './authAPi';
import { error } from 'console';
import { Wind } from 'lucide-react';

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// // Track if we're currently refreshing to prevent multiple simultaneous refresh attempts
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  
//   failedQueue = [];
// };

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// api.interceptors.response.use(
//   (response)=>response,
//   async (error)=>{
//     if(error?.statut==401){
//          const new_toke=getNewAccessToken()
//          error.config.headers["auAuthorization"] = `Bearer ${new_toke}`;
//         return api.request(error.config);
//     }
//     else{
//       const new_toke=getNewAccessToken()
//          error.config.headers["auAuthorization"] = `Bearer ${new_toke}`;
//         return api.request(error.config);
 

//   }
// }
// )
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // If we're already refreshing, queue this request
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         }).catch(err => {
//           return Promise.reject(err);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (!refreshToken) {
//           throw new Error("No refresh token available");
//         }

//         const newToken = await getNewAccessToken();

//         if (!newToken) {
//           throw new Error("Failed to refresh token");
//         }

//         // Update the original request with new token
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
//         // Process queued requests
//         processQueue(null, newToken);
        
//         // Retry the original request
//         return api(originalRequest);

//       } catch (err) {
//         // Process queued requests with error
//         processQueue(err, null);
        
//         // Clear storage and redirect
//         localStorage.clear();
        
//         // More robust redirect handling
//         if (typeof window !== 'undefined') {
//           window.location.href = "/login";
//         }
        
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );



export default api;