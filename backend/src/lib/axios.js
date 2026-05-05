const axios = require("axios");

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.message);
    return Promise.reject(error);
  },
);

module.exports = api;
