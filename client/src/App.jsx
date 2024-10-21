import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import { AuthProvider, useAuth } from './configs/AuthContext'; // Ensure useAuth is imported
import ProtectedRoute from './configs/ProtectedRoute';
import Services from './pages/Services';
import Landingpage from './pages/Landingpage';
=======
import { AuthProvider } from './configs/AuthContext';
// import ProtectedRoute from './configs/ProtectedRoute';
import Services from './pages/Services';
import Landingpage from './pages/Landingpage';
// import TechnicianContainer from './pages/TechnicianContainer';
// import AdminServices from './components/AdminUploadPage';
import NotFound from './pages/404';
import ServiceDetail from './pages/ServiceDetail';
import MakePayment from './components/MakePayment';
import DescriptionBox from './components/DescriptionBox';
// import TechnicianList from './components/TechnicianList';
import TechnicianPanel from './components/TechnicianPannel';
import TechnicianDetailPage from './pages/TechnicianDetailPage';
>>>>>>> 6d553d5be19b63d05233051cb9e86ba6161e1161
import AdminDashboard from './components/AdminDashboard';
import TechnicianListPage from './pages/TechniciansListPage';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/404';

const App = () => {
<<<<<<< HEAD
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
=======

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
                <Route path='/technician-panel' element={<TechnicianPanel/>} />
                <Route path='/technician-list' element={<TechnicianListPage />} />
                <Route path='/technician/:id' element={<TechnicianDetailPage />} />
                <Route path='/admin' element={<AdminDashboard />} />

                {/* Admin Protected Route */}
                {/* <Route 
                    path='/admin' 
                    element={<ProtectedRoute element={<AdminServices />} allowedRoles={['admin']} />} 
                /> */}
                {/* <Route path='/admin-dashboard' element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} /> */}

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

>>>>>>> 6d553d5be19b63d05233051cb9e86ba6161e1161

                    {/* 404 Not Found */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;