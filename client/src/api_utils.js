import axios from 'axios';

const baseURL = 'https://api.example.com'; // Replace with your API's base URL
const baseURL_auth = 'https://api.example.com'; // Replace with your API's base URL

const api = axios.create({
    baseURL,
});
const api_auth = axios.create({
    baseURL_auth,
});
export const postData = async (endpoint, data) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`Error making POST request to ${endpoint}:`, error);
        throw new Error('An error occurred while making the request.');
    }
};
