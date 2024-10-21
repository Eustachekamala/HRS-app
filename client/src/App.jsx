import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './configs/AuthContext'; // Ensure useAuth is imported
import ProtectedRoute from './configs/ProtectedRoute';
import Services from './pages/Services';
import Landingpage from './pages/Landingpage';
import AdminDashboard from './components/AdminDashboard';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/404';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landingpage />} />
                    <Route path='/services' element={<Services />} />
                    
                      {/* Admin Protected Route */}
                    <Route 
                        path='/admin-dashboard' 
                        element={
                            <ProtectedRoute 
                                element={<AdminDashboard />} 
                                allowedRoles={['admin']} 
                            />
                        } 
                    />
                    
                    {/* Authentication Routes */}
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />

                    {/* 404 Not Found */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;