import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://137.74.199.214:5000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
});

export default axiosClient;
