import React from 'react';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
import SecurityGuardPage from './pages/SecurityGuardPage';
import AdminPage from './pages/AdminPage';
import { Toaster } from 'sonner';
import FeedBack from './components/FeedBack';

function App() {
  const location  = useLocation()
  const isFeedbackPage = location.pathname.startsWith('/feedback')
  return (
    <>
    <Toaster position="top-right" richColors />
    {!isFeedbackPage && <Header />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/securityguard" element={<SecurityGuardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path = '/feedback/:bookingId' element = {<FeedBack/>}/>
        </Routes>
    </>
  )
}

export default App
