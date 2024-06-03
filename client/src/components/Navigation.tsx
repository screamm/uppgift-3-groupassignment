import { NavLink } from "react-router-dom";
import icon from "../img/lvl2.png";

export const Navigation = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <img src={icon} alt="Icon" />
        </li>
        <li>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        <li>
          <NavLink to={"/mypages"}>My Pages</NavLink>
        </li>
        <li>
          <NavLink to={"/contact"}>Contact</NavLink>
        </li>
        <li>
          <NavLink to={"/login"}>Login</NavLink>
        </li>
        <li>
          <NavLink to={"/register"}>Register</NavLink>
        </li>
        <li>
          <button className="logout-btn">Log out</button>
        </li>
      </ul>
    </nav>
  );
};
