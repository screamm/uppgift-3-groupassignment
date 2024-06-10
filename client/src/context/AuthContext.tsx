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
  login: (user: User, stripeSessionId: string) => void;
  logout: () => void;
  stripeId: string | null;
  stripeSessionId: string | null;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
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

  const login = (user: User, stripeSessionId: string) => {
    setUser(user);
    setStripeSessionId(stripeSessionId);
    console.log("User logged in:", user);
    console.log("Stripe Session ID:", stripeSessionId);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("stripeSessionId", stripeSessionId);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        setUser(null);
        setStripeSessionId(null);
        localStorage.removeItem("user");
        localStorage.removeItem("stripeSessionId");
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

// import { createContext, useContext, useState, ReactNode } from "react";
// import { logoutUser } from "../services/api";
// import { useNavigate } from "react-router-dom";

// interface User {
//   _id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   subscriptionId?: string;
//   role: string;
//   stripeId?: string;
// }

// interface IAuthContext {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (user: User, sessionId: string) => void;
//   logout: () => void;
//   stripeId: string | null;
//   sessionId: string | null;
// }

// const AuthContext = createContext<IAuthContext | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const login = (user: User, sessionId: string) => {
//     setUser(user);
//     setSessionId(sessionId);
//     console.log("User logged in:", user);
//     console.log("Session ID:", sessionId);
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("stripeSessionId", sessionId);
//     console.log(
//       "User logged in with stripeId:",
//       user.stripeId,
//       "and sessionId:",
//       sessionId
//     );
//     console.log("User role:", user.role);
//     console.log("User subscriptionId:", user.subscriptionId);
//     console.log("User email:", user.email);
//   };

//   const logout = async () => {
//     try {
//       const response = await logoutUser();
//       if (response.status === 200) {
//         setUser(null);
//         setSessionId(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("stripeSessionId");
//         console.log("User logged out");
//         navigate("/");
//       } else {
//         console.error("Logout failed with status:", response.status);
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         login,
//         logout,
//         stripeId: user?.stripeId || null,
//         sessionId,
//       }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
