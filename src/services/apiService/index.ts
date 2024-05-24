import axios from 'axios';
import { stringify } from 'qs';
import { apiErrorHandler } from "./errorHandler";

export const apiService = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  responseType: 'json',
  paramsSerializer: (params) =>
    stringify(params, {
      arrayFormat: 'brackets',
      encode: false,
    })
});

apiService.interceptors.request.use(
  (request) => {
    return request;
  }
);

apiService.interceptors.response.use((res) => res, apiErrorHandler);
