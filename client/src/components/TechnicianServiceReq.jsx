import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchRequests as apiFetchRequests } from '../api';

const TechnicianServiceRequests = ({ technicianName }) => {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestsForTechnician = async () => {
            const token = localStorage.getItem('token'); 
            if (!token) {
                setError('No authorization token found.');
                setLoading(false);
                return;
            }

            try {
                const requests = await apiFetchRequests(token);
                setServiceRequests(requests);
            } catch (err) {
                console.log(err)
                setError('Failed to fetch service requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequestsForTechnician();
    }, [technicianName]);

    if (loading) {
        return <p className="text-gray-400">Loading service requests...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Service Requests for {technicianName}</h2>
            <div className="w-full max-w-lg">
                {serviceRequests.length > 0 ? (
                    <ul className="space-y-4">
                        {serviceRequests.map((request) => (
                            <li key={request.id} className="bg-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                <h3 className="text-lg font-semibold text-blue-400">{request.customerName}</h3>
                                <p className="text-gray-300">
                                    Service Type: <span className="font-medium">{request.serviceType}</span>
                                </p>
                                <p className="text-gray-300">
                                    Description: <span className={`font-medium ${request.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>{request.description}</span>
                                </p>
                                <p className="text-gray-300">
                                    Date: <span className="font-medium">{new Date(request.date).toLocaleDateString()}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No service requests found.</p>
                )}
            </div>
        </div>
    );
};

TechnicianServiceRequests.propTypes = {
    technicianName: PropTypes.string.isRequired,
};

export default TechnicianServiceRequests;