import axios from "axios";

// Change this baseURL to your backend URL
const api = axios.create({
  baseURL: "https://dogsafety-z6t2.onrender.com/api", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
