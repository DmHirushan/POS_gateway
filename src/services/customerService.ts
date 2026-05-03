import type { Customer } from "../types/customer";
import { customerApi } from "./api"

export const getCustomers = async () => {
    const response = await customerApi.get("/customers");
    return response.data;
};

export const deleteCustomer = async (id: number) => {
    const response = await customerApi.delete(`/customer/${id}`);
    return response.data;
}

export const addCustomer = async (customer: Customer) => {
    const response = await customerApi.post("/customer/", customer);
    return response.data;
}