// services/api.js
import axios from 'axios';

export const handleApiRequest = async (method, url, data = null) => {
  const token = localStorage.getItem('token');
  
  // If no token, throw an error
  if (!token) throw new Error('No token found.');

  try {
    // Make the API request with axios
    const response = await axios({
      method, // POST, GET, PUT, DELETE
      url,    // The endpoint
      data,   // The data to send (for POST, PUT)
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });

    // Return the response data
    return response.data;
  } catch (err) {
    // Handle token expiration (401 error)
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token'); // Remove the expired token
      throw new Error('Session expired. Please log in again.');
    } else {
      throw err; // Rethrow other errors
    }
  }
};
