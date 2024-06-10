import { createContext, useContext, useState, ReactNode } from "react";
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
  login: (user: User, sessionId: string) => void;
  logout: () => void;
  stripeId: string | null;
  sessionId: string | null;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = (user: User, sessionId: string) => {
    setUser(user);
    setSessionId(sessionId);
    console.log(
      "User logged in with stripeId:",
      user.stripeId,
      "and sessionId:",
      sessionId
    );
  };

  const logout = async () => {
    try {
      const response = await logoutUser();

      if (response.status === 200) {
        setUser(null);
        setSessionId(null);
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
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        stripeId: user?.stripeId || null,
        sessionId,
      }}>
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
