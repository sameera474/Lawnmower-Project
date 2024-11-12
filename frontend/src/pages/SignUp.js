// src/pages/SignUp.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Form.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation popup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, {
        name,
        email,
        password,
      });

      // Show confirmation popup
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Signup failed:", error);
      // Check if error response exists and has a data message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Signup failed: ${error.response.data.message}`);
      } else if (error.message === "Network Error") {
        alert("Network error: Check your connection or backend server.");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>

      {showConfirmation && (
        <div className="confirmation-popup">
          <p>Signup successful! Redirecting to login...</p>
        </div>
      )}

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#007BFF" }}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
