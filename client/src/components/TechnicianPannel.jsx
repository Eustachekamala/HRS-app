import React, { useState, useEffect } from 'react';
import TechnicianServiceRequests from './TechnicianServiceReq';
import axios from 'axios';
import PropTypes from 'prop-types';

const TechnicianPanel = ({ technicianId }) => {
    // State variables
    const [assignedRequests, setAssignedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch service requests for the technician
    useEffect(() => {
        const fetchRequests = async () => {
            if (technicianId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/technician/${technicianId}/requests`);
                    setAssignedRequests(response.data);
                } catch (error) {
                    setError(error.message);
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

    // Technician name (could be fetched or passed as a prop)
    const technicianName = "Eustache Kamala";

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Technician Panel</h1>
            <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">Assigned Service Requests</h2>
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