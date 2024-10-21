import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import TechnicianList from './TechnicianList';
import axios from 'axios';
import PropTypes from 'prop-types';

const AdminDashboard = ({ userRole }) => {
    const [technicians, setTechnicians] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [statistics, setStatistics] = useState({});
    const navigate = useNavigate(); 

    useEffect(() => {
        // Check if user is an admin
        if (userRole !== 'admin') {
            navigate('/unauthorized');
            return;
        }

        const fetchData = async () => {
            try {
                const [techResponse, requestsResponse, statsResponse] = await Promise.all([
                    axios.get('/technicians'),
                    axios.get('/requests'),
                    axios.get('/payment'),
                ]);
                setTechnicians(techResponse.data);
                setUserRequests(requestsResponse.data);
                setStatistics(statsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userRole, navigate]);

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

// AdminDashboard.propTypes = {
//     userRole: PropTypes.string.isRequired, 
// };

export default AdminDashboard;