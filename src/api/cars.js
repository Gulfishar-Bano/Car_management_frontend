import axios from "axios";

const BASE_URL = "https://carmanagementsystem-production.up.railway.app"; // your backend URL

// Fetch all cars
export const getCars = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cars/list`);
    return response.data; // should be array of cars
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

// Add a new car
export const addCar = async (carData) => {
  try {
    const response = await axios.post(`${BASE_URL}/cars/create`, carData);
    return response.data;
  } catch (error) {
    console.error("Error adding car:", error);
    return null;
  }
};

// Fetch all brands
export const getBrands = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/car-brand/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// Fetch all car types
export const getCarTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/car-type/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching car types:", error);
    return [];
  }
};

// Fetch all drivers
export const getDrivers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/driver/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }};

  export const searchFares = async (queryParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: queryParams,
    });
    return response.data; // backend returns list of results with token
  } catch (error) {
    console.error("Error searching fares:", error);
    return [];
  }
};

