import axios from "axios";
const API_URL = import.meta.env.VITE_BASE_URL;
console.log("API URL:", API_URL);


const getTasks = async (token) => {
  try {
    const response = await axios.get(`${API_URL}tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Tasks fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
const getTaskById = async (id,token) => {
  try{
    const response = await axios.get(`${API_URL}tasks/${id}`, {
      headers:
          {authorization: `Bearer ${token}`},
    })
    return response.data;
  }catch(error){
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
const createTask = async (taskData, token) => {
  try {
    const response = await axios.post(`${API_URL}tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Task created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

const updateTask = async (id, taskData,token) => {
  try {
    const response = await axios.put(`${API_URL}tasks/${id}`, taskData,{
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    console.log("Task updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
const deleteTask = async (id,token) => {
  try {
    const response = await axios.delete(`${API_URL}tasks/${id}`,{
      headers: {authorization: `Bearer ${token}`,}
    });
    console.log("Task deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
export { getTasks,getTaskById, createTask, updateTask, deleteTask };