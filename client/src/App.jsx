// import React, { useEffect, useState } from 'react';
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
// import TechnicianList from './components/TechnicianList';
// import TechnicianPage from './pages/TechnicianPage';
import AdminDashboard from './components/AdminDashboard';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import Signout from './pages/Signout'; 
import ForgotPassword from './pages/ForgotPassword';
// import { fetchTechnicians as apiFetchTechnicians } from './api';

const App = () => {
    // const [technicians, setTechnicians] = useState([]); 
    // const [loading, setLoading] = useState(true);

    // Function to get token from local storage
    // const getToken = () => localStorage.getItem('token');

    // useEffect(() => {
    //     const fetchTechnicians = async () => {
    //         const token = getToken();

    //         if (!token) {
    //             setLoading(false);
    //             return;
    //         }

    //         try {
    //             const response = await apiFetchTechnicians();
    //             setTechnicians(response.data); // Assuming the API returns an array of technicians
    //         } catch (error) {
    //             console.error('Error fetching technicians:', error);
    //             setTechnicians([]); // Resetting to an empty array on error
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchTechnicians();
    // }, []);

    return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path='/' element={<Landingpage />} />
                <Route path='/payment' element={<MakePayment />} />
                <Route path='/description' element={<DescriptionBox />} />
                {/* <Route 
                    path='/technicians' 
                    element={loading ? <p>Loading technicians...</p> : <TechnicianList technicians={technicians || []} />} 
                /> */}
                {/* <Route 
                    path='/technician' 
                    element={technicians.length > 0 ? <TechnicianPage technician={technicians[0]} /> : <NotFound />} 
                /> */}
                <Route path='/services' element={<Services />} />

                {/* Admin Protected Route */}
                {/* <Route 
                    path='/admin' 
                    element={<ProtectedRoute element={<AdminServices />} allowedRoles={['admin']} />} 
                /> */}
                <Route path='/admin-dashboard' element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />

                <Route path='/service/:id' element={<ServiceDetail />} />

                {/* Authentication Routes */}
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/signout' element={<Signout />} />

                {/* 404 Not Found */}
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Router>
    </AuthProvider>
);


};

export default App;
