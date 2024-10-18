// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import TechnicianList from './TechnicianList';
import axios from 'axios';

const AdminDashboard = () => {
    const [technicians, setTechnicians] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        // Fetch technicians
        axios.get('/technicians').then(response => {
            setTechnicians(response.data);
        });

        // Fetch user requests
        axios.get('/user-requests').then(response => {
            setUserRequests(response.data);
        });

        // Fetch statistics (e.g., number of requests, active technicians)
        axios.get('/statistics').then(response => {
            setStatistics(response.data);
        });
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
                <TechnicianList technicians={technicians} />
            </section>

            <section>
                <h2>View User Requests</h2>
                <ul>
                    {userRequests.map((request) => (
                        <li key={request.id}>
                            {request.description} - {request.user.username}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminDashboard;
