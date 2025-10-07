import axios from "axios";

// Change this baseURL to your backend URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
