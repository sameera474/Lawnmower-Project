// src/pages/Home.js
import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Sahka</h1>
        <p>
          At Sahka, we redefine modern living with advanced home robotics.
          Explore our cutting-edge innovations designed to make everyday life
          more convenient, efficient, and connected.
        </p>
        <p>
          Get started by learning more about us or creating an account to
          experience our robotic solutions firsthand.
        </p>
        <button className="home-button">Learn More About Our Products</button>
      </div>
    </div>
  );
};

export default Home;
