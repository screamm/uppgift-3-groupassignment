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
  stripeSubId?: string; // Lägg till stripeSubId här
}

interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, stripeSessionId: string, stripeSubId: string) => void; // Uppdatera signaturen
  logout: () => void;
  stripeId: string | null;
  stripeSessionId: string | null;
  subscriptionId: string | null;
  stripeSubId: string | null; // Lägg till stripeSubId här
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        localStorage.removeItem("user"); // Ta bort ogiltigt värde från localStorage
      }
    }
    return null;
  });

  const [stripeSessionId, setStripeSessionId] = useState<string | null>(() => {
    return localStorage.getItem("stripeSessionId");
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user && stripeSessionId) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("stripeSessionId", stripeSessionId);
    }
  }, [user, stripeSessionId]);

  const login = (user: User, stripeSessionId: string, stripeSubId: string) => {
    setUser({ ...user, stripeSubId }); // Uppdatera användardata med stripeSubId
    setStripeSessionId(stripeSessionId);
    console.log("User logged in:", user);
    console.log("Stripe Session ID:", stripeSessionId);
    console.log("Stripe Subscription ID:", stripeSubId);
    localStorage.setItem("user", JSON.stringify({ ...user, stripeSubId }));
    localStorage.setItem("stripeSubId", stripeSubId);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        setUser(null);
        setStripeSessionId(null);
        localStorage.clear();

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
        stripeSessionId,
        subscriptionId: user?.subscriptionId || null,
        stripeSubId: user?.stripeSubId || null, // Lägg till stripeSubId här
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
