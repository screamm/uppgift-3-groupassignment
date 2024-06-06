import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const registerUser = (userData: any, selectedProduct: any) => {
  return axios.post(`${API_URL}/auth/register`, {...userData, selectedProduct });
};

export const loginUser = (userData: any) => {
  return axios.post(`${API_URL}/auth/login`, userData);
};

export const logoutUser = () => {
  return axios.post(`${API_URL}/auth/logout`);
};
