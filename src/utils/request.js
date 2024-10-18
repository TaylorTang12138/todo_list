import axios from "axios";

const request = axios.create({
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use((config) => {
  return config;
});

request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (rej) => {}
);

export default request;
