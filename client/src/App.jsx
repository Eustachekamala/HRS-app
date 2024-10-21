import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './configs/AuthContext'; 
import ProtectedRoute from './configs/ProtectedRoute';
import Services from './pages/Services';
import Landingpage from './pages/Landingpage';
import NotFound from './pages/404';
import ServiceDetail from './pages/ServiceDetail';
import MakePayment from './components/MakePayment';
import DescriptionBox from './components/DescriptionBox';
import TechnicianPanel from './components/TechnicianPanel';
import TechnicianDetailPage from './pages/TechnicianDetailPage';
import AdminDashboard from './components/AdminDashboard';
import TechnicianListPage from './pages/TechniciansListPage';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import ForgotPassword from './pages/ForgotPassword';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landingpage />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/payment' element={<MakePayment />} />
                    <Route path='/description' element={<DescriptionBox />} />
                    <Route path='/technician-panel' element={<TechnicianPanel />} />
                    <Route path='/technician-list' element={<TechnicianListPage />} />
                    <Route path='/technician/:id' element={<TechnicianDetailPage />} />
                    <Route path='/service/:id' element={<ServiceDetail />} />

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