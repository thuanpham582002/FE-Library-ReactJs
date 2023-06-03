import axios from 'axios';

export default function createAxiosInstance(token) {
    return axios.create({
        baseURL: 'http://localhost:2023/api',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    });
}