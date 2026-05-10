import { orderApi } from "./api";

export const getOrders = async () => {
    const response = await orderApi.get("/transactions");
    return response.data;
};

export const saveOrder = async (data: any) =>{
    const response = await orderApi.post("/transactions", data);
    return response.data;
}

export const updateOrder = async (id: Number, data: any) => {
    const response = await orderApi.put(`/transactions/${id}`, data);
    return response.data;
}