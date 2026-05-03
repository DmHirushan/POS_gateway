import axios from "axios";

export const itemApi = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
    headers: {
        "Content-Type": "Application/json",
    },
});

export const customerApi = axios.create({
    baseURL: "http://localhost:8081",
    timeout: 5000,
    headers: {
        "Content-Type": "Application/json",
    }
});