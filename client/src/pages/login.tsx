import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";
import alpaca from "../img/alp.png";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //en liten kommentar

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      console.log("Login successful:", response.data);

      setErrorMessage("");
      login(response.data, response.data.stripeSessionId); // Skicka sessionId när användaren loggar in
      console.log("User logged in:", response.data);

      navigate("/mypages");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <img className="alpaca-img" src={alpaca} alt="alpaca" />
      <div className="login-container">
        <h1>Login</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
