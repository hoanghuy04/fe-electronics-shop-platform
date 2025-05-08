import { post, put } from "./request";

export const categoryService = {
    addCategory: async (data) => {
        // POST request to your API
        const response = await post("categories", data);

        if (!response) {
            throw new Error("Failed to add category");
        }
        return response;
    },
    updateCategory: async (id, data) => {
        const response = await put(`categories/${id}`, data);
        if (!response) {
            throw new Error("Failed to update category");
        }
        return response;
    },
};