import React, { useState, useEffect } from 'react';
import TechnicianList from './TechnicianList';
import axios from 'axios';

const AdminDashboard = () => {
    const [technicians, setTechnicians] = useState([]); // Start as an empty array
    const [userRequests, setUserRequests] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch technicians
                const techResponse = await axios.get('/technicians');
                setTechnicians(Array.isArray(techResponse.data) ? techResponse.data : []);

                // Fetch user requests
                const userResponse = await axios.get('/user-requests');
                if (Array.isArray(userResponse.data)) {
                    setUserRequests(userResponse.data);
                } else {
                    console.error('Expected an array for user requests, but got:', userResponse.data);
                    setUserRequests([]);
                }

                // Fetch statistics (e.g., number of requests, active technicians)
                const statsResponse = await axios.get('/payment');
                setStatistics(statsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setTechnicians([]); // Resetting to empty array on error
                setUserRequests([]); // Resetting user requests on error
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <section>
                <h2>Statistics</h2>
                <p>Total Requests: {statistics.totalRequests}</p>
                <p>Active Technicians: {statistics.activeTechnicians}</p>
            </section>

            <section>
                <h2>Manage Technicians</h2>
                {loading ? (
                    <p>Loading technicians...</p>
                ) : (
                    <TechnicianList technicians={technicians} />
                )}
            </section>

            <section>
                <h2>View User Requests</h2>
                {loading ? (
                    <p>Loading user requests...</p>
                ) : (
                    <ul>
                        {userRequests.map((request) => (
                            <li key={request.id}>
                                {request.description} - {request.user.username}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
