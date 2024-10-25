import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaMoneyBillWave, FaClipboardList, FaHeartbeat, FaPlus } from 'react-icons/fa';
import { fetchStatistics as fetchStatisticsFromAPI } from '../api';
import Statistics from './Statistics';
import TechnicianRequests from './TechnicianServiceReq';
import Navbar from './Navbar';
import Modal from './Modal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const technicianRef = useRef(null);
    const [userRequests, setUserRequests] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [payments, setPayments] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formType, setFormType] = useState('');

    // State for technician form
    const [technicianData, setTechnicianData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        image_path: '',
        occupation: '',
        history: '',
        realizations: ''
    });
    const [techError, setTechError] = useState('');
    const [techSuccess, setTechSuccess] = useState('');

    // State for service form
    const [serviceData, setServiceData] = useState({
        service_type: '',
        description: '',
        image: null
    });
    const [serviceError, setServiceError] = useState('');
    const [serviceSuccess, setServiceSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('/requests');
                setUserRequests(Array.isArray(userResponse.data) ? userResponse.data : []);
                
                const statsResponse = await fetchStatisticsFromAPI();
                setStatistics(statsResponse);
                
                const paymentResponse = await axios.get('/payment');
                setPayments(Array.isArray(paymentResponse.data) ? paymentResponse.data : []);
                
                const technicianResponse = await axios.get('/technicians');
                setTechnicians(Array.isArray(technicianResponse.data) ? technicianResponse.data : []);
            } catch (error) {
                setUserRequests([]);
                setPayments([]);
                setStatistics({});
                setTechnicians([]);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddTechnician = () => {
        setFormType('technician');
        setIsModalOpen(true);
    };

    const handleAddService = () => {
        setFormType('service');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Reset forms
        setTechnicianData({
            username: '',
            password: '',
            email: '',
            phone: '',
            image_path: '',
            occupation: '',
            history: '',
            realizations: ''
        });
        setTechError('');
        setTechSuccess('');

        setServiceData({
            service_type: '',
            description: '',
            image: null
        });
        setServiceError('');
        setServiceSuccess('');
    };

    const handleTechnicianChange = (e) => {
        const { name, value } = e.target;
        setTechnicianData({ ...technicianData, [name]: value });
    };

    const handleServiceChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    const handleFileChange = (e) => {
        setServiceData({ ...serviceData, image: e.target.files[0] });
    };

    const handleTechnicianSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        try {
            const response = await axios.post('http://127.0.0.1:5000/technicians', technicianData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTechSuccess('Technician added successfully!');
            setTechError('');
            closeModal(); // Close the modal after successful addition
        } catch (err) {
            console.error("Error details:", err.response);
            setTechError(err.response?.data?.error || 'Failed to add technician.');
            setTechSuccess('');
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        const formData = new FormData();
        formData.append('service_type', serviceData.service_type);
        formData.append('description', serviceData.description);
        formData.append('image', serviceData.image);

        try {
            const response = await axios.post('http://127.0.0.1:5000/services', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setServiceSuccess('Service added successfully!');
            setServiceError('');
            closeModal(); // Close the modal after successful addition
        } catch (err) {
            console.error("Error details:", err.response);
            setServiceError(err.response?.data?.error || 'Failed to add service.');
            setServiceSuccess('');
        }
    };

    return (
        <>
            <Navbar />
            <div className="h-full pt-6 md:p-2 bg-gray-900 flex items-center justify-center">
                <div className="w-full max-w-4xl p-6 bg-gray-800 shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-300 mb-6">Super Admin Dashboard</h1>

                    {/* Button Group */}
                    <div className='flex flex-col sm:flex-row gap-4 justify-end mb-4'>
                        <button 
                            onClick={handleAddTechnician} 
                            className="flex items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                        >
                            <FaPlus className="mr-2" /> Add Technician
                        </button>
                        <button 
                            onClick={handleAddService} 
                            className="flex items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                        >
                            <FaPlus className="mr-2" /> Add Service
                        </button>
                    </div>

                    {error && <p className="text-red-500">{error.message}</p>}

                    {/* Statistics Section */}
                    <Statistics statistics={statistics} loading={loading} />

                    {/* User Requests Section */}
                    <section className="mb-6 p-4 border rounded-lg bg-gray-400">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center mb-2">
                            <FaClipboardList className="mr-2" /> View User Requests
                        </h2>
                        <TechnicianRequests technicianId={1} />
                    </section>

                    {/* Payments Section */}
                    <section className="mb-6 p-4 border rounded-lg bg-gray-400">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center mb-2">
                            <FaMoneyBillWave className="mr-2" /> View Payments
                        </h2>
                        {loading ? (
                            <p className="text-gray-500">Loading payments...</p>
                        ) : (
                            <ul className="list-disc list-inside">
                                {payments.map((payment) => (
                                    <li key={payment.id} className="py-2 border-b last:border-b-0 hover:bg-gray-300 transition-colors">
                                        Payment ID: {payment.id} - Amount: ${payment.amount} - Status: {payment.status}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Technicians Section */}
                    <section 
                        ref={technicianRef} 
                        className="mb-6 p-4 border rounded-lg bg-gray-400"
                        onClick={() => technicianRef.current.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center mb-2">
                            <FaUsers className="mr-2" /> View Technicians
                        </h2>
                        {loading ? (
                            <p className="text-gray-500">Loading technicians...</p>
                        ) : (
                            <ul className="list-disc list-inside">
                                {technicians.map((technician) => (
                                    <li key={technician.id} className="py-2 border-b last:border-b-0 hover:bg-gray-300 transition-colors">
                                        Username: {technician.username} - Email: {technician.email} - Phone: {technician.phone} - Occupation: {technician.occupation}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* System Health Section */}
                    <section className="mb-6 p-4 border rounded-lg bg-gray-400">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center mb-2">
                            <FaHeartbeat className="mr-2" /> System Health
                        </h2>
                        <p className="text-gray-700">All systems operational.</p>
                    </section>
                </div>
            </div>

            {/* Modal for Add Technician or Add Service */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    {formType === 'technician' ? (
                        <form onSubmit={handleTechnicianSubmit} className="space-y-4">
                            {techError && <p className="text-red-500">{techError}</p>}
                            {techSuccess && <p className="text-green-500">{techSuccess}</p>}
                            <input 
                                type="text" 
                                name="username" 
                                value={technicianData.username} 
                                onChange={handleTechnicianChange} 
                                placeholder="Username" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="email" 
                                name="email" 
                                value={technicianData.email} 
                                onChange={handleTechnicianChange} 
                                placeholder="Email" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="password" 
                                name="password" 
                                value={technicianData.password} 
                                onChange={handleTechnicianChange} 
                                placeholder="Password" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="text" 
                                name="phone" 
                                value={technicianData.phone} 
                                onChange={handleTechnicianChange} 
                                placeholder="Phone" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="file" 
                                name="image_path" 
                                onChange={handleTechnicianChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="text" 
                                name="occupation" 
                                value={technicianData.occupation} 
                                onChange={handleTechnicianChange} 
                                placeholder="Occupation" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type='text'
                                name='history'
                                value={technicianData.history}
                                onChange={handleTechnicianChange}
                                placeholder='History'
                                required
                                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <textarea
                                name='realizations'
                                value={technicianData.realizations}
                                onChange={handleTechnicianChange}
                                placeholder='Realizations'
                                required
                                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'                                
                            />
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                            >
                                Add Technician
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleServiceSubmit} className="space-y-4">
                            {serviceError && <p className="text-red-500">{serviceError}</p>}
                            {serviceSuccess && <p className="text-green-500">{serviceSuccess}</p>}
                            <input 
                                type="text" 
                                name="service_type" 
                                value={serviceData.service_type} 
                                onChange={handleServiceChange} 
                                placeholder="Service Type" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea 
                                name="description" 
                                value={serviceData.description} 
                                onChange={handleServiceChange} 
                                placeholder="Description" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="file" 
                                name="image" 
                                onChange={handleFileChange} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                            >
                                Add Service
                            </button>
                        </form>
                    )}
                </Modal>
            )}
        </>
    );
};

export default AdminDashboard;
