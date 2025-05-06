import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../services/auth.service";
import { path } from "../constants/path";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    const auth = await authApi.login(userData);
    if (auth) {
      toast.success("Đăng nhập thành công");
      setUser(auth);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(auth));
      // Redirect based on role
      if (auth.role === "ADMIN") {
        navigate(path.homeAdmin);
      } else {
        navigate(path.home);
      }
    } else {
      toast.error("Tài khoản hoặc mật khẩu không đúng");
    }
  };

  const register = async (user) => {
    const newUser = await authApi.register(user);
    if (newUser) {
      toast.success("Tài khoản đã được tạo");
      navigate(path.login);
    }
  };

  const logout = () => {
    setUser({});
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);