// src/pages/Settings.js
import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import axios from "axios";

const Settings = () => {
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Fetch settings from backend on component mount
    const fetchSettings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/api/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { accountName, email, notifications, theme } = response.data;
        setAccountName(accountName);
        setEmail(email);
        setNotifications(notifications);
        setTheme(theme);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/settings",
        { accountName, email, notifications, theme },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <p>Configure your account settings and application preferences here.</p>

      <div className="settings-section">
        <h2>Account Settings</h2>
        <label>
          Account Name:
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div className="settings-section">
        <h2>Preferences</h2>
        <label>
          Notifications:
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </label>
        <label>
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>

      <button className="save-button" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
