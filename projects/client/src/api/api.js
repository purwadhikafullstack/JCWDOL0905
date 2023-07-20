import axios from 'axios'

export const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
    headers: {
        secretKey: process.env.REACT_APP_API_SECRET_KEY
    }
})
