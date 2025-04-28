
import "./Profile.css"; // Ensure proper styling
import React, { useState } from "react";

const Profile = ({ user, setUser }) => {
  // ✅ Always call useState at the top level
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dob: user?.dob || "",
    education: user?.education || "",
    phone: user?.phone || "",
  });

  // ✅ Ensure user is loaded before rendering the form
  if (!user) return <p>Loading...</p>;

  const handleSave = () => {
    setUser({ ...user, ...formData }); // ✅ Update user state
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>Profile Information</h2>
      <form className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={user.name} disabled />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={user.email} disabled />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Education:</label>
          <input
            type="text"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="button-group">
          {isEditing ? (
            <button type="button" className="save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
