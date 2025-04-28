import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />  
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
        <Route path="/chat" element={user ? <Chatbot /> : <Login setUser={setUser} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
