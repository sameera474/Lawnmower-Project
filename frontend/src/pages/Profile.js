// src/pages/Profile.js
import React from "react";
import "../styles/Profile.css";

const Profile = ({ user }) => {
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      {user ? (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
