import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};
