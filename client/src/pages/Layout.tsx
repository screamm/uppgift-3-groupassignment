import { Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import "../styles/layout.css";
import { AuthProvider } from "../context/AuthContext";


export const Layout = () => {
  return (
    <AuthProvider>
      <header className="navbar">
        <Navigation />
      </header>
      <main className="outlet">
        <Outlet />
      </main>
      </AuthProvider>
  );
};