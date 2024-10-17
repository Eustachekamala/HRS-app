// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './configs/AuthContext';
import ProtectedRoute from './configs/ProtectedRoute';
import Services from './pages/Services';
import Landingpage from './pages/Landingpage';
import AdminServices from './components/AdminUploadPage';
import NotFound from './pages/404';
import ServiceDetail from './pages/ServiceDetail';
import MakePayment from './components/MakePayment';
import DescriptionBox from './components/DescriptionBox';
import TechnicianList from './components/TechnicianList';
import TechnicianPage from './pages/TechnicianPage';
import Login from './pages/Login'; // Import Login component
import Signup from './pages/Signup'; // Import Signup component
import Signout from './pages/Signout'; // Import Signout component
import ForgotPassword from './pages/ForgotPassword'; // Import ForgotPassword component
import axios from 'axios';

const App = () => {
    const [technicians, setTechnicians] = useState([]);

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await axios.get('http://localhost:5000/technician');
                if (Array.isArray(response.data.technicians)) {
                    setTechnicians(response.data.technicians);
                } else {
                    console.error('Expected an array, but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching technicians:', error);
                setTechnicians([]);
            }
        };

        fetchTechnicians();
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landingpage />} />
                    <Route path='/payment' element={<MakePayment />} />
                    <Route path='/description' element={<DescriptionBox />} />
                    <Route path='/technicians' element={<TechnicianList technicians={technicians} />} />
                    <Route path='/technician' element={<TechnicianPage />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/admin' element={<AdminServices />} />
                    <Route path='/service/:id' element={<ServiceDetail />} />
                    
                    {/* Authentication Routes */}
                    <Route path='/login' element={<Login setUser={() => {}} />} /> {/* Pass setUser function */}
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/signout' element={<Signout setUser={() => {}} />} /> {/* Pass setUser function */}

                    {/* Protected Routes */}
                    <Route 
                        path="/protected" 
                        element={<ProtectedRoute element={<ProtectedComponent />} />} 
                    />
                    <Route 
                        path="/services" 
                        element={<ProtectedRoute element={<Services />} />}
                    />

                    {/* 404 Not Found */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const ProtectedComponent = () => <h2>Protected Component</h2>;

export default App;