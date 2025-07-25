import axios from "axios";
const API_URL = import.meta.env.VITE_BASE_URL;
console.log("API URL:", API_URL);

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}auth/register`, userData);
    console.log("User registered successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}auth/login`, credentials);
    console.log("User logged in successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
const getUserById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}auth/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("All users fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
export { registerUser, loginUser,getAllUsers,getUserById};