import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

const Home = ({ user }) => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div>
        <h1>Welcome to SchemeEase</h1>
        <p>Please log in or sign up to access the chatbot and government scheme information.</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {!showChat ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <button onClick={() => setShowChat(true)} className="nav-btn">
            Start Chat
          </button>
        </>
      ) : (
        <Chatbot />
      )}
    </div>
  );
};

export default Home;
