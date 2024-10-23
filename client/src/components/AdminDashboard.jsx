import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnicianList from './TechnicianList';
import axios from 'axios';
import { FaUsers, FaChartLine, FaMoneyBillWave, FaClipboardList, FaHeartbeat, FaPlus } from 'react-icons/fa';
import { fetchStatistics as fetchStatisticsFromAPI } from '../api';

const AdminDashboard = () => {
    const navigate = useNavigate(); // Initialize useNavigate for navigation
    const [technicians, setTechnicians] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const techResponse = await axios.get('/technicians');
                setTechnicians(Array.isArray(techResponse.data) ? techResponse.data : []);

                const userResponse = await axios.get('/requests');
                setUserRequests(Array.isArray(userResponse.data) ? userResponse.data : []);

                // Fetch statistics
                const token = localStorage.getItem('access_token');
                const statsResponse = await fetchStatisticsFromAPI(token);
                setStatistics(statsResponse);

                const paymentResponse = await axios.get('/payment');
                setPayments(Array.isArray(paymentResponse.data) ? paymentResponse.data : []);

            } catch (error) {
                console.error('Error fetching data:', error);
                setTechnicians([]);
                setUserRequests([]);
                setPayments([]);
                setStatistics({});
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddTechnician = () => {
        navigate('/add-technician');
    };

    return (
        <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
            <div className="max-w-4xl w-full p-6 bg-gray-800 shadow-md rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-300 mb-6">Super Admin Dashboard</h1>

                {/* Add Technician Button */}
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={handleAddTechnician} 
                        className="flex items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                    >
                        <FaPlus className="mr-2" /> Add Technician
                    </button>
                </div>

                <section className="mb-6 p-4 border rounded-lg bg-gray-400 transition-opacity opacity-0 animate-fadeIn">
                    <h2 className="text-xl font-semibold text-blue-600 flex items-center">
                        <FaChartLine className="mr-2" /> Statistics
                    </h2>
                    {loading ? (
                        <p className="text-gray-500">Loading statistics...</p>
                    ) : (
                        <>
                            {statistics.total_requests !== undefined ? (
                                <>
                                    <p className="text-gray-700">Total Requests: {statistics.total_requests || 0}</p>
                                    <p className="text-gray-700">Active Technicians: {statistics.active_technicians || 0}</p>
                                </>
                            ) : (
                                <p className="text-red-500">Error loading statistics</p>
                            )}
                        </>
                    )}
                </section>

                <section className="mb-6 p-4 border rounded-lg bg-gray-400 transition-opacity opacity-0 animate-fadeIn">
                    <h2 className="text-xl font-semibold text-blue-600 flex items-center">
                        <FaUsers className="mr-2" /> Manage Technicians
                    </h2>
                    {loading ? (
                        <p className="text-gray-500">Loading technicians...</p>
                    ) : (
                        <TechnicianList technicians={technicians} />
                    )}
                </section>

                <section className="mb-6 p-4 border rounded-lg bg-gray-400 transition-opacity opacity-0 animate-fadeIn">
                    <h2 className="text-xl font-semibold text-blue-600 flex items-center">
                        <FaClipboardList className="mr-2" /> View User Requests
                    </h2>
                    {loading ? (
                        <p className="text-gray-500">Loading user requests...</p>
                    ) : (
                        <ul className="list-disc list-inside">
                            {userRequests.map((request) => (
                                <li key={request.id} className="py-2 border-b last:border-b-0 hover:bg-gray-300 transition-colors">
                                    {request.description} - <span className="font-semibold">{request.user.username}</span>
                                </li>
                            ))}
                        </ul>
                    )}
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
    );
};

export default AdminDashboard;