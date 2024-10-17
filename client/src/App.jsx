// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './configs/AuthContext';
// import ProtectedRoute from './configs/ProtectedRoute'; // Uncomment if using this
import Services from './pages/Services';
import Landingpage from './pages/Landingpage';
import AdminServices from './components/AdminUploadPage';
import './App.css';
import NotFound from './pages/404';
import ServiceDetail from './pages/ServiceDetail';
import MakePayment from './components/MakePayment';
import DescriptionBox from './components/DescriptionBox';
import TechnicianList from './components/TechnicianList';
import TechnicianPage from './pages/TechnicianPage';
import axios from 'axios';

const App = () => {
    const [technician, setTechnician] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchTechnician = async () => {
            try {
                const response = await axios.get('http://0.0.0.0:5000/technician');
                setTechnician(response.data);
            } catch (error) {
                console.error('Error fetching technician:', error);
                setTechnician(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTechnician();
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landingpage />} />
                    <Route path='/payment' element={<MakePayment />} />
                    <Route path='/description' element={<DescriptionBox />} />
                    <Route 
                        path='/technicians' 
                        element={loading ? <p>Loading technicians...</p> : <TechnicianList technicians={[technician]} />} 
                    />
                    <Route path='/technician' element={<TechnicianPage technician={technician} />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/admin' element={<AdminServices />} />
                    <Route path='/service/:id' element={<ServiceDetail />} />
                    <Route path='*' element={<NotFound />} />
                    {/* Uncomment if you need protected routes */}
                    {/* 
                    <Route 
                        path="/protected" 
                        element={<ProtectedRoute element={<ProtectedComponent />} />} 
                    />
                    <Route 
                        path="/services" 
                        element={<ProtectedRoute element={<Services />} />}
                    /> */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

// Uncomment this if you have a protected component
// const ProtectedComponent = () => <h2>Protected Component</h2>;

export default App;
