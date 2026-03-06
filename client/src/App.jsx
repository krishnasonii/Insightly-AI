import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Background from './components/Background';
import Home from './pages/Home';
import LiveRecap from './pages/LiveRecap';
import History from './pages/History';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import VideoCall from './pages/VideoCall';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicOnlyRoute from './components/routing/PublicOnlyRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) return (
    <div className="loading-screen" style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020617',
      color: '#6366f1',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    }}>
      <span>Initializing Insightly AI...</span>
    </div>
  );

  return (
    <Router>
      <div className="app-container">
        <Background />
        <Navbar />
        <main className="container fade-in">
          <Routes>
            {}
            <Route path="/" element={<Home />} />

            <Route path="/login" element={
              <PublicOnlyRoute>
                <Auth />
              </PublicOnlyRoute>
            } />
            <Route path="/signup" element={
              <PublicOnlyRoute>
                <Auth />
              </PublicOnlyRoute>
            } />

            {}
            <Route path="/dashboard" element={<Navigate to="/live" replace />} />

            <Route path="/live" element={
              <ProtectedRoute>
                <LiveRecap />
              </ProtectedRoute>
            } />

            <Route path="/video" element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
