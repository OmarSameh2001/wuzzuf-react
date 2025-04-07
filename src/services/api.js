import axios from "axios";

const API_BASE_URL = "http://localhost:8000/";

export const AxiosApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    AxiosApi.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete AxiosApi.defaults.headers.common["Authorization"];
  }
};