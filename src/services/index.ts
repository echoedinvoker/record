import axios from "axios";


const api = axios.create({
  baseURL: "http://44.201.114.25:8000",
  // baseURL: "http://localhost:8000",
  withCredentials: true
});

export default api;
