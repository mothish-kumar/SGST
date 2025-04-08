import React from 'react';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SecurityGuardPage from './pages/SecurityGuardPage';
import AdminPage from './pages/AdminPage';
import { Toaster } from 'sonner';

function App() {


  return (
    <>
    <Toaster position="top-right" richColors />
    <Header/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/securityguard" element={<SecurityGuardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
    </>
  )
}

export default App
