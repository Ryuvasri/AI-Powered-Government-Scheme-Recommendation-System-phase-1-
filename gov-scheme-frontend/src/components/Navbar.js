import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear user session
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <h2>SchemeEase</h2>
      
      {/* Navbar Right Section */}
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={handleLogout}>Logout</Link>
            
            {/* Profile Icon Moved to Right */}
            <div className="profile-icon" onClick={() => navigate('/profile')}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
