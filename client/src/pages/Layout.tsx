import { Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import "../styles/layout.css";


export const Layout = () => {
  return (
    <div>
      <header className="navbar">
        <Navigation />
      </header>
      <main className="outlet">
        <Outlet />
      </main>
    </div>
  );
};