import axios from "axios";

const API_URL = "https://carmanagementsystem-production.up.railway.app/booking"; 

// Create a new booking
export const createBooking = async (data) => {
  const token = localStorage.getItem("token"); 
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/CreateBooking`, data, authHeader);
  return response.data;
};

// Get all bookings (admin)
export const getAllBookings = async () => {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/list`, authHeader);
  return response.data;
};

// Get booking by ID
export const getBooking = async (id) => {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/list/${id}`, authHeader);
  return response.data;
};


export const updateBooking = async (id, data) => {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.patch(`${API_URL}/update/${id}`, data, authHeader);
  return response.data;
};


export const assignCarDriver = async (bookingId, carId, driverId) => {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/assign`, { bookingId, carId, driverId }, authHeader);
  return response.data;
};
