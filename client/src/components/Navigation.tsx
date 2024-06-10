import { NavLink } from "react-router-dom";
import icon from "../img/lvl2.png";
import { useAuth } from "../context/AuthContext";

export const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink to="/">
            {" "}
            <img src={icon} alt="Icon" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/mypages">My Pages</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
        {isAuthenticated ? (
          <li>
            <button className="logout-btn" onClick={logout}>
              Log out
            </button>
          </li>
        ) : (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
  console.log(isAuthenticated);
};
