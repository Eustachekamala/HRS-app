import React, { useState, useEffect } from 'react';
import TechnicianServiceRequests from './TechnicianServiceReq';
import axios from 'axios';
import PropTypes from 'prop-types';

const TechnicianPanel = ({ technician_request_id }) => {
    // State variables
    const [assignedRequests, setAssignedRequests] = useState([]);
    const [technicianName, setTechnicianName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch service requests and technician details
    useEffect(() => {
        const fetchData = async () => {
            if (technician_request_id) {
                try {
                    // Fetch assigned service requests
                    const requestsResponse = await axios.get(
                        `https://hrs-app-1.onrender.com/technician_requests/${technician_request_id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    setAssignedRequests(requestsResponse.data);

                    // Fetch technician details
                    const technicianResponse = await axios.get(
                        `https://hrs-app-1.onrender.com/technicians/${technician_request_id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    setTechnicianName(technicianResponse.data.name); 
                } catch (error) {
                    // Handle errors
                    setError(error.response?.data?.message || error.message || 'An error occurred');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [technician_request_id]);

    // Loading state
    if (loading) {
        return <p>Loading requests...</p>;
    }

    // Error handling
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Technician Panel</h1>
            <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">Assigned Service Requests for {technicianName}</h2>
                <TechnicianServiceRequests 
                    technicianName={technicianName}
                    serviceRequests={assignedRequests}
                />
            </section>
        </div>
    );
};

TechnicianPanel.propTypes = {
    technician_request_id: PropTypes.number.isRequired,
};

export default TechnicianPanel;
