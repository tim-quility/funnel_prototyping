import axios from 'axios';

// --- 1. Centralized Configuration (using Environment Variable) ---
const api = axios.create({
  // Use environment variable for the API URL (e.g., REACT_APP_API_URL in .env)
  // Defaults to http://localhost:5000 if the variable is not set.
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 2. Request Interceptor (Attach JWT for Authentication) ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Add the Authorization header using the Bearer scheme
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, 
(error) => {
  // Handle request errors (e.g., network issues before sending)
  return Promise.reject(error);
});

// --- 3. Response Interceptor (Global Error Handling) ---
api.interceptors.response.use(
  (response) => {
    // Return successful responses directly
    return response;
  },
  (error) => {
    // Check for specific error responses
    if (error.response) {
      const { status } = error.response;
      console.log(error)

      // Handle 401 Unauthorized errors globally
      if (status === 401) {
        console.error('Unauthorized request (401). Clearing token and redirecting to login.');
        
        // **ACTION:** Clear the stored token (if applicable)
        localStorage.removeItem('token'); 
        
        // **ACTION:** Redirect user to the login page (or refresh token logic)
        // Ensure this logic works within your specific routing setup (e.g., React Router)
        // window.location.href = '/login'; 
      }
      
      // Handle 403 Forbidden errors globally
      if (status === 403) {
        console.warn('Forbidden request (403). User lacks necessary permissions.');
      }
      
      // You can add more global error handlers here (e.g., 500 server errors)
    }

    // Pass the error down to the component that made the request
    return Promise.reject(error);
  }
);

export default api;