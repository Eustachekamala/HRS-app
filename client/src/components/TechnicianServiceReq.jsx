import React, { useState, useEffect } from 'react';
import { fetchTechnicianRequests } from '../api';
import Proptypes from 'prop-types';

const TechnicianRequests = ({ technicianId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('No token provided');
                }

                const requestsResponse = await fetchTechnicianRequests(token, technicianId);
                setRequests(requestsResponse);
            } catch (error) {
                console.error('Error fetching technician requests:', error);
                setError(error.message || 'Failed to load technician requests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [technicianId]);

    return (
        <div className="min-h-80 bg-gray-900 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-white mb-6">Technician Requests</h1>
            {loading ? (
                <p className="text-gray-500">Loading requests...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div>
                    {requests.length === 0 ? (
                        <p className="text-gray-500">No requests found for this technician.</p>
                    ) : (
                        <ul>
                            {requests.map(request => (
                                <li key={request.id} className="text-gray-700">
                                    {/* Adjust according to the structure of your request object */}
                                    <p><strong>Request ID:</strong> {request.id}</p>
                                    <p><strong>Status:</strong> {request.status}</p>
                                    {/* Add any other relevant details */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

TechnicianRequests.propTypes = {
    technicianId: Proptypes.number.isRequired,}

export default TechnicianRequests;