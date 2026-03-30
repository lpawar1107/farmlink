import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FarmMarket from './FarmMarket';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fm_user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        {/* Render FarmMarket for all app routes so internal views (profile, chat, map) open inside the phone UI */}
        <Route path="/" element={<FarmMarket user={user} setUser={setUser} />} />
        <Route path="/chat" element={<FarmMarket user={user} setUser={setUser} />} />
        <Route path="/cart" element={<FarmMarket user={user} setUser={setUser} />} />
        <Route path="/map" element={<FarmMarket user={user} setUser={setUser} />} />
        <Route path="/profile" element={<FarmMarket user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}