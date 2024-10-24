import React, { useState, useEffect } from 'react';
import TechnicianServiceRequests from './TechnicianServiceReq';
import axios from 'axios';
import PropTypes from 'prop-types';

const TechnicianPanel = ({ technicianId }) => {
    // State variables
    const [assignedRequests, setAssignedRequests] = useState([]);
    const [technicianName, setTechnicianName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch service requests for the technician
    useEffect(() => {
        const fetchRequests = async () => {
            if (technicianId) {
                try {
                    const requestsResponse = await axios.get(
                        `http://127.0.0.1:5000/technicians/${technicianId}/requests`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    setAssignedRequests(requestsResponse.data);
                    
                    // Fetch technician details
                    const technicianResponse = await axios.get(
                        `http://127.0.0.1:5000/technicians/${technicianId}`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    setTechnicianName(technicianResponse.data.name); // Assuming the response has a 'name' field
                } catch (error) {
                    // Check for error responses and set a message accordingly
                    setError(error.response?.data?.message || error.message || 'An error occurred');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRequests();
    }, [technicianId]);

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
    technicianId: PropTypes.number.isRequired,
};

export default TechnicianPanel;