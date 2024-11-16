// src/pages/Home.js
import React from "react";
import "../styles/Home.css";
import product1 from "../images/product1.jpg";
import product2 from "../images/product2.jpg";
import product3 from "../images/product3.jpg";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to SAHKA</h1>
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

      <div className="product-display" id="products">
        <h2>Our Products</h2>
        <div className="product-grid">
          <div className="product-item">
            <img src={product1} alt="Product 1" />
            <p>Smart Vacuum</p>
          </div>
          <div className="product-item">
            <img src={product2} alt="Product 2" />
            <p>AI Lawn Mower</p>
          </div>
          <div className="product-item">
            <img src={product3} alt="Product 3" />
            <p>Home Security Bot</p>
          </div>
        </div>
      </div>

      <footer className="footer" id="contact">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Email: info@sahka.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 123 Robotics Street, Tech City</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
