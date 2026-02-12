 const BASE_URL = import.meta.env.VITE_BASE_URL

import axios from "axios";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout:10000
});
