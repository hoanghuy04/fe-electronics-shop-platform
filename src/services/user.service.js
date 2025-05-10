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
      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format");
      }
      
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getNoUsersByMonthYear: async (month, year) => {
    try {
      const response = await get("users");
      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format");
      }

      const filteredUsers = response.filter((user) => {
        const date = new Date(user.created_at);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });

      return filteredUsers.length;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getTotalUsersBeforeYear: async (year) => {
    try {
      const response = await get("users");
      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format");
      }

      const filteredUsers = response.filter((user) => {
        const date = new Date(user.created_at);
        return date.getFullYear() < year;
      });

      return filteredUsers.length;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};
