import type { Item } from "../types/item";
import { itemApi } from "./api";


export const getItems = async () => {
    const response = await itemApi.get("/items");
    return response.data;
}

export const deleteItem = async (id: number) => {
    const response = await itemApi.delete(`/items/${id}`);
    return response.data;
}

export const addItem = async (item: Omit<Item, "id">) => {
    const response = await itemApi.post("/items/", item);
    return response.data;
}