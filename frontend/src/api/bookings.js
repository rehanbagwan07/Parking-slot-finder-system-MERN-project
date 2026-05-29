import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const fetchBookings = async () => {
  const res = await axios.get(`${API_URL}/bookings`);
  return res.data;
};

export const createBooking = async (data) => {
  const res = await axios.post(`${API_URL}/bookings`, data);
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await axios.put(`${API_URL}/bookings/${id}/cancel`);
  return res.data;
};

export const completeBooking = async (id) => {
  const res = await axios.put(`${API_URL}/bookings/${id}/complete`);
  return res.data;
};
