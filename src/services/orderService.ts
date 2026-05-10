import { orderApi } from "./api";

export const getOrders = async () => {
    const response = await orderApi.get("/transactions");
    return response.data;
};

export const saveOrder = async (data: any) =>{
    const response = await orderApi.post("/transactions", data);
    return response.data;
}