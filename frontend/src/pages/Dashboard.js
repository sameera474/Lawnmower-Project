// // src/pages/Dashboard.js
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Line } from "react-chartjs-2";
// import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
// import Speedometer from "react-d3-speedometer";
// import "leaflet/dist/leaflet.css";
// import "chart.js/auto";
// import "../styles/Dashboard.css";

// const Dashboard = ({ user }) => {
//   const navigate = useNavigate();

//   // Redirect to login if user is not authenticated
//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       console.log("User not authenticated");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const [speedData, setSpeedData] = useState([]);
//   const [batteryData, setBatteryData] = useState([]);
//   const [cuttingPattern, setCuttingPattern] = useState("Zigzag");
//   const [labels, setLabels] = useState([]);
//   const [polygon, setPolygon] = useState([]);
//   const [speed, setSpeed] = useState(0);
//   const [battery, setBattery] = useState(100);
//   const [isMowerRunning, setIsMowerRunning] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [renderTrigger, setRenderTrigger] = useState(0); // Trigger to force re-render

//   const mowerStatus = isMowerRunning ? "Running" : "Stopped";

//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         setPolygon((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
//       },
//     });
//     return null;
//   };

//   // Update current time every second
//   useEffect(() => {
//     const timeInterval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timeInterval);
//   }, []);

//   // Force re-render of chart on initial load and each data update
//   useEffect(() => {
//     setRenderTrigger((prev) => prev + 1);
//   }, [speedData, batteryData, labels]);

//   const saveDataToHistory = useCallback(async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("No authorization token found. Please log in.");
//       alert("No authorization token found. Please log in.");
//       return;
//     }

//     const historyEntry = {
//       timestamp: currentTime.toISOString(),
//       speed,
//       batteryLevel: battery,
//       cuttingPattern,
//       lawnArea: polygon,
//     };

//     try {
//       const response = await fetch("http://localhost:5000/api/history", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(historyEntry),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Error: ${response.status} - ${errorText}`);
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       alert("Data saved to history!");
//     } catch (error) {
//       console.error("Error saving history data:", error);
//     }
//   }, [currentTime, speed, battery, cuttingPattern, polygon]);

//   const stopMower = useCallback(() => {
//     setIsMowerRunning(false);
//     saveDataToHistory();
//   }, [saveDataToHistory]);

//   const resetMap = () => {
//     setPolygon([]);
//   };

//   useEffect(() => {
//     let interval;

//     if (isMowerRunning) {
//       interval = setInterval(() => {
//         const newSpeed = Math.floor(Math.random() * 10);
//         const newBattery = Math.max(0, battery - 1);

//         setSpeed(newSpeed);
//         setBattery(newBattery);

//         setSpeedData((prev) => [...prev, newSpeed]);
//         setBatteryData((prev) => [...prev, newBattery]);
//         setLabels((prev) => [...prev, new Date().toLocaleTimeString()]);

//         if (newBattery <= 0) {
//           stopMower();
//         }
//       }, 2000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isMowerRunning, battery, stopMower]);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Speed (km/h)",
//         data: speedData,
//         borderColor: "rgba(75,192,192,1)",
//         fill: false,
//       },
//       {
//         label: "Battery Level (%)",
//         data: batteryData,
//         borderColor: "rgba(255,99,132,1)",
//         fill: false,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//       x: {
//         display: labels.length > 0,
//       },
//     },
//   };

//   return (
//     <div className="dashboard container">
//       <div className="header">
//         <h1>Dashboard</h1>
//         <p>{currentTime.toLocaleString()}</p>
//       </div>

//       <div className="status-indicator">
//         <p>
//           Mower Status: <strong>{mowerStatus}</strong>
//         </p>
//       </div>

//       <div className="map-container">
//         <MapContainer
//           center={[60.192059, 24.945831]}
//           zoom={13}
//           style={{ height: "300px" }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <MapClickHandler />
//           {polygon.length > 1 && <Polygon positions={polygon} color="blue" />}
//         </MapContainer>
//         <p>Click to set lawn mowing area boundaries</p>
//         <button className="button" onClick={resetMap}>
//           Reset Area
//         </button>
//         <button className="button" onClick={saveDataToHistory}>
//           Save Area
//         </button>
//       </div>

//       <div className="speedometer">
//         <h3>Speed</h3>
//         <Speedometer value={speed} minValue={0} maxValue={10} segments={5} />
//       </div>

//       <div className="battery">
//         <h3>Battery Level</h3>
//         <div className="battery-indicator">
//           <div className="battery-fill" style={{ height: `${battery}%` }}></div>
//         </div>
//         <p>{battery}%</p>
//       </div>

//       <div className="chart-container">
//         <Line data={data} options={options} key={renderTrigger} />
//       </div>

//       <div>
//         <h3>Current Cutting Pattern: {cuttingPattern}</h3>
//         <button
//           className="button"
//           onClick={() =>
//             setCuttingPattern((prev) =>
//               prev === "Zigzag" ? "Spiral" : "Zigzag"
//             )
//           }
//         >
//           Change Cutting Pattern
//         </button>
//         <button
//           className="button"
//           onClick={() => {
//             setIsMowerRunning(true);
//             console.log("Starting the mower...");
//           }}
//         >
//           Start Mower
//         </button>
//         <button className="button" onClick={stopMower}>
//           Stop Mower
//         </button>
//       </div>

//       <button className="button" onClick={() => navigate("/history")}>
//         View History Data
//       </button>
//     </div>
//   );
// };

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import Speedometer from "react-d3-speedometer";
import "leaflet/dist/leaflet.css";
import "chart.js/auto";
import "../styles/Dashboard.css";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      console.log("User not authenticated");
      navigate("/login");
    }
  }, [navigate]);

  const [speedData, setSpeedData] = useState([]);
  const [batteryData, setBatteryData] = useState([]);
  const [cuttingPattern, setCuttingPattern] = useState("Zigzag");
  const [labels, setLabels] = useState([]);
  const [polygon, setPolygon] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [battery, setBattery] = useState(100);
  const [isMowerRunning, setIsMowerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [mapCenter, setMapCenter] = useState([60.192059, 24.945831]); // Default to Helsinki

  const mowerStatus = isMowerRunning ? "Running" : "Stopped";

  // Function to handle map click events for setting lawn area boundaries
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPolygon((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
      },
    });
    return null;
  };

  // Fetch the user's current location using the Geolocation API
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            setMapCenter([latitude, longitude]);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    setRenderTrigger((prev) => prev + 1);
  }, [speedData, batteryData, labels]);

  const saveDataToHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authorization token found. Please log in.");
      return;
    }

    const historyEntry = {
      timestamp: currentTime.toISOString(),
      speed,
      batteryLevel: battery,
      cuttingPattern,
      lawnArea: polygon,
    };

    try {
      const response = await fetch("http://localhost:5000/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(historyEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to save data.");
      }

      alert("Data saved to history!");
    } catch (error) {
      console.error("Error saving history data:", error);
    }
  }, [currentTime, speed, battery, cuttingPattern, polygon]);

  const stopMower = useCallback(() => {
    console.log("Stopping the mower...");
    setIsMowerRunning(false);
    saveDataToHistory();
    console.log("Mower stopped.");
  }, [saveDataToHistory]);

  const resetMap = () => {
    setPolygon([]);
  };

  useEffect(() => {
    let interval;
    if (isMowerRunning) {
      interval = setInterval(() => {
        const newSpeed = Math.floor(Math.random() * 10);
        const newBattery = Math.max(0, battery - 1);

        setSpeed(newSpeed);
        setBattery(newBattery);

        setSpeedData((prev) => [...prev, newSpeed]);
        setBatteryData((prev) => [...prev, newBattery]);
        setLabels((prev) => [...prev, new Date().toLocaleTimeString()]);

        console.log(`Speed: ${newSpeed} km/h, Battery: ${newBattery}%`);

        if (newBattery <= 0) {
          stopMower();
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMowerRunning, battery, stopMower]);

  const data = {
    labels,
    datasets: [
      {
        label: "Speed (km/h)",
        data: speedData,
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
      {
        label: "Battery Level (%)",
        data: batteryData,
        borderColor: "rgba(255,99,132,1)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true }, x: { display: labels.length > 0 } },
  };

  return (
    <div className="dashboard container">
      <div className="header">
        <h1>Dashboard</h1>
        <p>{currentTime.toLocaleString()}</p>
      </div>

      <div className="status-indicator">
        <p>
          Mower Status: <strong>{mowerStatus}</strong>
        </p>
      </div>

      <div className="map-container">
        <MapContainer center={mapCenter} zoom={13} style={{ height: "300px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler />
          {polygon.length > 1 && <Polygon positions={polygon} color="blue" />}
        </MapContainer>
        <p>Click to set lawn mowing area boundaries</p>
        <button className="button" onClick={resetMap}>
          Reset Area
        </button>
        <button className="button" onClick={saveDataToHistory}>
          Save Area
        </button>
        <div className="coordinates">
          <h4>Selected Coordinates:</h4>
          <ul>
            {polygon.map((coord, index) => (
              <li key={index}>{`[${coord[0].toFixed(4)}, ${coord[1].toFixed(
                4
              )}]`}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="speedometer">
        <h3>Speed</h3>
        <Speedometer value={speed} minValue={0} maxValue={10} segments={5} />
      </div>

      <div className="battery">
        <h3>Battery Level</h3>
        <div className="battery-indicator">
          <div
            className={`battery-fill ${
              battery <= 20 ? "low" : battery <= 50 ? "medium" : "high"
            }`}
            style={{ height: `${battery}%` }}
          ></div>
        </div>
        <p className="battery-level-text">{battery}%</p>
      </div>

      <div className="chart-container">
        <Line data={data} options={options} key={renderTrigger} />
      </div>

      <div className="cutting-pattern">
        <h3>Current Cutting Pattern: {cuttingPattern}</h3>
        <button
          className="button"
          onClick={() =>
            setCuttingPattern((prev) =>
              prev === "Zigzag" ? "Spiral" : "Zigzag"
            )
          }
        >
          Change Cutting Pattern
        </button>
      </div>

      <div className="mower-controls">
        <button
          className="button"
          onClick={() => {
            setIsMowerRunning(true);
            console.log("Starting the mower...");
          }}
        >
          Start Mower
        </button>
        <button className="button" onClick={stopMower}>
          Stop Mower
        </button>
        <button className="button" onClick={() => navigate("/history")}>
          View History Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
