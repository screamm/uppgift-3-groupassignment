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

export const getUserData = async (sessionId: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/session/${sessionId}`, { withCredentials: true });
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
