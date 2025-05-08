import { toast } from "sonner";
import { get, post } from "./request";

export const authApi = {
  login: async (user) => {
    try {
      const users = await get(
        `users?email=${user.email}&password=${user.password}`
      );

      if (users.length > 0) {
        return users[0];
      } else {
        toast.error("Sai email hoặc mật khẩu");
        return null;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập");
      return null;
    }
  },

  register: async (user) => {
    try {
      const existing = await get(`users?email=${user.email}`);
      if (existing.length > 0) {
        toast.error("Email đã tồn tại");
        return null;
      }

      const response = await post("users", {
        name: user.firstName + " " + user.lastName,
        email: user.email,
        password: user.password,
        gender: parseInt(user.gender) ?? 1,
        phone: user.phone ?? "",
        dob: user.dob ?? "",
        role: "USER",
        address: [],
      });

      return response;
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Lỗi khi tạo tài khoản");
      return null;
    }
  },
};
