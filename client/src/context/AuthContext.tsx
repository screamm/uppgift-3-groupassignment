import { createContext, useContext, useState, ReactNode } from 'react';
import { logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionId?: string;
  role: string;
  stripeId?: string; // Lägg till stripeId här
}

interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();

      if (response.status === 200) {
        setUser(null);
        console.log('User logged out');
        navigate("/");
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { logoutUser } from '../services/api'; // Adjust the import path as necessary
// import { useNavigate } from 'react-router-dom';

// interface IAuthContext {
//   isAuthenticated: boolean;
//   userId: string | null;
//   login: (id: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<IAuthContext | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [userId, setUserId] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserId = sessionStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = (id: string) => {
//     console.log('Setting user ID:', id);
//     setUserId(id);
//     setIsAuthenticated(true);
//     sessionStorage.setItem('userId', id);
//   };

//   const logout = async () => {
//     try {
//       const response = await logoutUser();

//       if (response.status === 200) {
//         setIsAuthenticated(false);
//         setUserId(null);
//         sessionStorage.removeItem('userId');
//         console.log('User logged out');
//         navigate("/");
//       } else {
//         console.error('Logout failed with status:', response.status);
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };






// import { createContext, useContext, useState, ReactNode } from 'react';
// import { logoutUser } from '../services/api';
// import { useNavigate } from 'react-router-dom';

// interface IAuthContext {
//   isAuthenticated: boolean;
//   login: () => void;
//   logout: () => void;
// }

// const AuthContext = createContext<IAuthContext | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const navigate = useNavigate();


//   const login = () => {
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     try {
//       const response = await logoutUser();

//       if (response.status === 200) {
//         setIsAuthenticated(false);
//         console.log('User logged out');
//         navigate("/");

//       } else {
//         console.error('Logout failed with status:', response.status);
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };
  

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
