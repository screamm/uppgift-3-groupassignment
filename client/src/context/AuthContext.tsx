import { createContext, useContext, useState, ReactNode } from 'react';
import { logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface IAuthContext {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();


  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const response = await logoutUser();

      if (response.status === 200) {
        setIsAuthenticated(false);
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
