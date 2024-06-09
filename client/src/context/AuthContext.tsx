import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { logoutUser } from "../services/api";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionId?: string;
  role: string;
  stripeId?: string;
}

interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  stripeId: string | null;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stripeId, setStripeId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedStripeId = localStorage.getItem("stripeId");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedStripeId) {
      setStripeId(storedStripeId);
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    setStripeId(user.stripeId || null);
    localStorage.setItem("user", JSON.stringify(user));
    if (user.stripeId) {
      localStorage.setItem("stripeId", user.stripeId);
    }
  };

  const logout = async () => {
    try {
      const response = await logoutUser();

      if (response.status === 200) {
        setUser(null);
        setStripeId(null);
        localStorage.removeItem("user");
        localStorage.removeItem("stripeId");
        console.log("User logged out");
        navigate("/");
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, stripeId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
