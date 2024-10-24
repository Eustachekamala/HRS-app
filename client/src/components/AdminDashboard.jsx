import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaMoneyBillWave, FaClipboardList, FaHeartbeat, FaPlus } from 'react-icons/fa';
import { fetchStatistics as fetchStatisticsFromAPI } from '../api';
import Statistics from './Statistics';
import TechnicianRequests from './TechnicianServiceReq';
import ManageTechnicians from './ManageTechnicians';
import Navbar from './Navbar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userRequests, setUserRequests] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('/requests');
                setUserRequests(Array.isArray(userResponse.data) ? userResponse.data : []);

                const statsResponse = await fetchStatisticsFromAPI();
                setStatistics(statsResponse);

                const paymentResponse = await axios.get('/payment');
                setPayments(Array.isArray(paymentResponse.data) ? paymentResponse.data : []);

            } catch (error) {
                setUserRequests([]);
                setPayments([]);
                setStatistics({});
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddTechnician = () => {
        navigate('/add-technician');
    };

    const handleService = () => {
        navigate('/add-service');
    };

    return (
        <>
            <Navbar />
            <div className="h-full pt-6 md:p-2 bg-gray-900 flex items-center justify-center">
                <div className="w-full  p-6 bg-gray-800 shadow-md rounded-lg">
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
                            onClick={handleService} 
                            className="flex items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                        >
                            <FaPlus className="mr-2" /> Add Service
                        </button>
                    </div>

                    <ManageTechnicians />

                    {error && <p className="text-red-500">{error.message}</p>}

                    {/* Statistics Section */}
                    <Statistics statistics={statistics} loading={loading} />

                    <section className="mb-6 p-4 border rounded-lg bg-gray-400 transition-opacity opacity-0 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center">
                            <FaClipboardList className="mr-2" /> View User Requests
                        </h2>
                        <TechnicianRequests technicianId={1} />
                    </section>

                    <section className="mb-6 p-4 border rounded-lg bg-gray-400 transition-opacity opacity-0 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center">
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

                    <section className="mb-6 p-4 border rounded-lg bg-gray-400 transition-opacity opacity-0 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center">
                            <FaHeartbeat className="mr-2" /> System Health
                        </h2>
                        <p className="text-gray-700">All systems operational.</p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
