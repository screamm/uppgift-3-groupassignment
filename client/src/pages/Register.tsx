import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { User } from "../models/User";

export const Register = () => {
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
  });

  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("You must accept the terms and conditions to register.");
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Registration successful:", response.data);
      setErrorMessage("");
      setSuccessMessage("Registration successful!");
    } catch (error: any) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      setErrorMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && (
        <p style={{ color: "green" }}>
          {successMessage} <Link to="/login">Login here</Link>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={handleCheckboxChange}
            />
            I accept the terms and conditions for storing personal data.
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
