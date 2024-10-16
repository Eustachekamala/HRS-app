// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './configs/AuthContext';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Signout from './pages/Signout';
import ProtectedRoute from './configs/ProtectedRoute';
// import Services from './pages/Services';
import Landingpage from './pages/Landingpage';
// import AdminServices from './components/AdminUploadPage';
import './App.css';
// import NotFound from './pages/404';
// import ServiceDetail from './pages/ServiceDetail';
import MakePayment from './components/MakePayment';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landingpage/>}/>
                    <Route path='/payment' element={<MakePayment/>}/>
                    {/* <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signout" element={<Signout />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/admin' element={<AdminServices />} />
                    <Route path='/service/:id' element={<ServiceDetail />} />
                    <Route path='*' element={<NotFound />} /> */}
                    <Route 
                        path="/protected" 
                        element={<ProtectedRoute element={<ProtectedComponent />} />} 
                    />
                    
                    <Route 
                        path="/services" 
                        // element={<ProtectedRoute element={<Services />} />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const ProtectedComponent = () => <h2>Protected Component</h2>;

export default App;
