import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const fetchSlots = async () => {
  const res = await axios.get(`${API_URL}/slots`);
  return res.data;
};

export const updateSlotStatus = async (id, status) => {
  const res = await axios.put(`${API_URL}/slots/${id}/status`, { status });
  return res.data;
};
