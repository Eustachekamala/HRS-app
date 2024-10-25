import React, { useState, useEffect } from 'react';
import TechnicianList from './TechnicianList';
import axios from 'axios';
import { FaUsers, FaMoneyBillWave, FaClipboardList, FaPlus} from 'react-icons/fa';
import Statistics from './Statistics';
import { useNavigate } from 'react-router-dom';
// import HealthCheckComponent from './SystemHealth';
import AdminNavbar from './AdminNavbar'; 


const AdminDashboard = () => {
    const [technicians, setTechnicians] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const techResponse = await axios.get('/technicians');
                setTechnicians(Array.isArray(techResponse.data) ? techResponse.data : []);

                const userResponse = await axios.get('/requests');
                if (Array.isArray(userResponse.data)) {
                    setUserRequests(userResponse.data);
                } else {
                    console.error('Expected an array for user requests, but got:', userResponse.data);
                    setUserRequests([]);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setTechnicians([]);
                setUserRequests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddTechnician = () => {
        navigate('/manage-technicians');
    };

    const handleAddService = () => {
        navigate('/add-service');
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <AdminNavbar />
            <h1 className="text-4xl font-extrabold text-center text-gray-100 mb-8">Admin Dashboard</h1>

            {/* Button Group */}
            <div className='flex flex-col sm:flex-row gap-4 justify-end mb-6'>
                <button 
                    onClick={handleAddTechnician} 
                    className="flex items-center bg-green-700 text-white p-3 rounded-lg hover:bg-green-600 transition transform hover:scale-105 shadow-lg"
                >
                    <FaUsers className="mr-2" /> Manage Technician
                </button>
                <button 
                    onClick={handleAddService} 
                    className="flex items-center bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-600 transition transform hover:scale-105 shadow-lg"
                >
                    <FaPlus className="mr-2" /> Add Service
                </button>
            </div>

            <section className="mb-8 p-6 bg-gray-800 text-white rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-gray-200 mb-4 flex items-center">
                    <FaUsers className="mr-2" /> Manage Technicians
                </h2>
                {loading ? (
                    <p className="text-gray-400">Loading technicians...</p>
                ) : (
                    <TechnicianList technicians={technicians} />
                )}
            </section>

            <section className='mb-8 p-6 bg-gray-800 rounded-lg shadow-md'>
                <h2 className='text-3xl font-semibold text-gray-200 mb-4 flex items-center'>
                    <FaClipboardList className="mr-2" /> Statistics
                </h2>
                {loading ? (
                    <p className="text-gray-400">Loading statistics...</p>
                ) : (
                    <Statistics />
                )}
            </section>

            <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-gray-200 mb-4 flex items-center">
                    <FaMoneyBillWave className="mr-2" /> View User Requests
                </h2>
                {loading ? (
                    <p className="text-gray-400">Loading user requests...</p>
                ) : (
                    <ul className="list-disc pl-5 text-gray-300">
                        {userRequests.map((request) => (
                            <li key={request.id} className="mb-2 hover:text-blue-400 transition-colors">
                                {request.description} - <span className="font-semibold">{request.user.username}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-gray-200 mb-4 flex items-center">
                    <FaHeartbeat className="mr-2" /> System Health
                </h2>
                <p className="text-gray-300">All systems operational.</p>
                <HealthCheckComponent />
            </section> */}
        </div>
    );
};

export default AdminDashboard;
