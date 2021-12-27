import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "https://nodejs-medical-api.herokuapp.com/api/v1",
});

console.log(process.env.REACT_APP_API_URL);

export default api;
