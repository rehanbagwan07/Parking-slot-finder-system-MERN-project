import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const fetchLocations = async () => {
  const res = await axios.get(`${API_URL}/locations`);
  return res.data;
};

export const createLocation = async (data) => {
  const res = await axios.post(`${API_URL}/locations`, data);
  return res.data;
};
