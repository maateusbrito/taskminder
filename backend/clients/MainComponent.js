import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginComponent from './LoginComponent';
import Dashboard from './Dashboard';

const MainComponent = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={authenticated ? <Navigate to="/dashboard" /> : <LoginComponent setAuthenticated={setAuthenticated} />} />
        <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default MainComponent;
