import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './configs/AuthContext';
import NotFound from './pages/404';
import DescriptionBox from './components/DescriptionBox';
import TechnicianList from './components/TechnicianList';
import TechnicianPage from './pages/TechnicianPage';
import AdminDashboard from './components/AdminDashboard';
import TechnicianPanel from './components/TechnicianPannel';
import AddTechnician from './pages/AddTechnician';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import Signout from './pages/Signout'; 
import ForgotPassword from './pages/ForgotPassword';
import { fetchTechnicians as apiFetchTechnicians } from './api';
import PaypalButton from './components/PaypalButton';
import TechnicianDetailPage from './pages/TechnicianDetailPage';
import ServiceRequestForm from './components/ServiceRequestForm';
import UploadService from './components/UploadService';
import ManageTechnicians from './components/ManageTechnicians';
import ServiceList from "./pages/ServiceList"; 
import ServiceForm from './pages/ServiceForm';
import Landingpage from './pages/Landingpage';
import { ToastContainer } from 'react-toastify';
import UserPanel from './components/UserPannel';

const App = () => {
    const [technicians, setTechnicians] = useState([]); 
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        const fetchTechnicians = async () => {
            const token = getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await apiFetchTechnicians();
                setTechnicians(response.data);
            } catch (error) {
                console.error('Error fetching technicians:', error);
                setTechnicians([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicians();
    }, []);

    return (
        <AuthProvider>
            <Router>
                <ToastContainer />
                <Routes>
                    <Route path='/' element={<Landingpage />} />
                    <Route path='/payment' element={<PaypalButton />} />
                    <Route path='/description' element={<DescriptionBox />} />
                    <Route 
                        path='/technicians' 
                        element={loading ? <p>Loading technicians...</p> : <TechnicianList technicians={technicians || []} />} 
                    />
                    <Route path='/technician-panel' element={<TechnicianPanel technicianId={1} />} />
                    <Route 
                        path='/technician' 
                        element={technicians.length > 0 ? <TechnicianPage technician={technicians[0]} /> : <NotFound />} 
                    />
                    <Route path='/technician-detail' element={<TechnicianDetailPage />} />
                    <Route path='/technician-detail/:id' element={<TechnicianDetailPage />} />
                    <Route path='/technician-detail/:id/service-detail' element={<TechnicianDetailPage />} />
                    <Route path='/service-request-form' element={<ServiceRequestForm />} />
                    <Route path='/add-technician' element={<AddTechnician />} />
                    <Route path="/manage-technicians" element={<ManageTechnicians />} />
                    <Route path="/add-service" element={<UploadService />} />
                    <Route path="/servicesForm" element={<ServiceForm />} />
                    <Route path="/services" element={<ServiceList showButton={true} />} />

                    <Route path='/admin-dashboard' element={<AdminDashboard />} />
                    <Route path='/user-panel' element={<UserPanel />} />

                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/signout' element={<Signout />} />

                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
