import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <h1>Smart Expense Tracker</h1>
      <p style={descriptionStyle}>
        Track your expenses, monitor your spending habits,
        and manage your finances efficiently.
      </p>

      <div style={buttonContainer}>
        <button onClick={() => navigate("/login")} style={loginBtn}>
          Login
        </button>

        <button onClick={() => navigate("/register")} style={registerBtn}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
};

const descriptionStyle = {
  maxWidth: "500px",
  marginBottom: "20px"
};

const buttonContainer = {
  display: "flex",
  gap: "20px"
};

const loginBtn = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer"
};

const registerBtn = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer"
};

export default Home;
