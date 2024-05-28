import { NavLink } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav>
      <ul className="nav-list">
        <li>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        <li>
          <NavLink to={"/mypages"}>My Account</NavLink>
        </li>
        <li>
          <NavLink to={"/contact"}>Contact</NavLink>
        </li>
        <li>
          <NavLink to={"/login"}>Login</NavLink>
        </li>
        <li>
          <button>Log out</button>
        </li>
      </ul>
    </nav>
  );
};