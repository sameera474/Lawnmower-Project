// src/pages/History.js
import React, { useState, useEffect } from "react";
import "../styles/History.css"; // Assuming you have a CSS file for styling

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch history data: ${response.statusText}`);
      }
      const data = await response.json();
      setHistoryData(data);
    } catch (error) {
      console.error("Error fetching history data:", error);
      setError(
        "Error loading history data. Please check your connection or try again later."
      );
    }
  };

  const clearHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/history", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to clear history data: ${response.statusText}`);
      }
      setHistoryData([]); // Clear history data in the frontend
      alert("History cleared successfully.");
    } catch (error) {
      console.error("Error clearing history data:", error);
      setError("Error clearing history data. Please try again.");
    }
  };

  return (
    <div className="history-container">
      <h1>History Data</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <button className="clear-history-button" onClick={clearHistory}>
            Clear History
          </button>
          {historyData.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Speed (km/h)</th>
                  <th>Battery Level (%)</th>
                  <th>Cutting Pattern</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                    <td>{item.speed}</td>
                    <td>{item.batteryLevel}</td>
                    <td>{item.cuttingPattern}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No history data available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default History;
