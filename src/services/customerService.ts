import type { Customer } from "../types/customer";
import { customerApi } from "./api"

export const getCustomers = async () => {
    const response = await customerApi.get("/customers");
    return response.data;
};

export const getCustomerById = async (id: number) => {
    const response = await customerApi.get(`/customers/${id}`);
    return response.data;
}

export const deleteCustomer = async (id: number) => {
    const response = await customerApi.delete(`/customers/${id}`);
    return response.data;
}

export const addCustomer = async (customer: Customer) => {
    console.log("addCustomer triggered..")
    const response = await customerApi.post("/customers", customer);
    return response.data;
}