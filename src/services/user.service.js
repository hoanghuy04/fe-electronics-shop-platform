import { get, patch } from "./request";

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
  getDefaultAddress: (user) => {
    if (!user || !user.address || !Array.isArray(user.address)) return null;

    return user.address.find((addr) => addr.default === 1) || null;
  },

  getAllUsers: async () => {
    try {
      const response = await get("users");
      console.log("Response from getAllUsers:", response);
      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format");
      }
      
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};
