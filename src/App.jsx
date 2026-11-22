import React, { useState, useEffect } from 'react' // Added useEffect
import { Routes, Route, Navigate, useNavigate, Outlet, useLocation } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import ManageReportPage from './it/ViewReport'
import Navbar from './Navbar'
import NewReportPage from './it/AddReport'
import SettingsPage from './setting/page'
import DocumentsPage from './Documents'
import MaternityReport from './it/MaternityReport'

/**
 * ProtectedLayout checks if a user is logged in.
 */
function ProtectedLayout({ user, onLogout }) {
  const location = useLocation();

  if (!user) {
    // We save the 'location' (the path the user tried to visit) in the 'from' state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  // --- UPDATED: Initialize user from localStorage ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hospital_user');
    return savedUser ? JSON.parse(savedUser) : null;
  })

  const navigate = useNavigate()

  // --- UPDATED: Save user to localStorage on login ---
  const handleLogin = (username, redirectTo = '/dashboard') => {
    const userData = { username };
    setUser(userData);
    localStorage.setItem('hospital_user', JSON.stringify(userData));
    navigate(redirectTo, { replace: true })
  }

  // --- UPDATED: Remove user from localStorage on logout ---
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hospital_user');
    navigate('/')
  }

  return (
    <div className="app-container">
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout user={user} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
          <Route path="/it-view" element={<ManageReportPage />} />
          <Route path="/it-add" element={<NewReportPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/it-maternityreport" element={<MaternityReport />} />
          <Route path="/setting" element={<SettingsPage user={user} />} />
        </Route>

        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}