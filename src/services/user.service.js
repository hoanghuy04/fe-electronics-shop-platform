import { patch } from "./request";

export const userApi = {
  updateProfile: async (userId, data) => {
    try {
      const response = await patch(`users/${userId}`, data);
      return response;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
