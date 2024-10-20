import React from 'react';
import Proptypes from 'prop-types';

const TechnicianServiceRequests = ({ technicianName, serviceRequests }) => {
    return (
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Service Requests for {technicianName}</h2>
            <div className="w-full max-w-lg">
                {serviceRequests.length > 0 ? (
                    <ul className="space-y-4">
                        {serviceRequests.map((request) => (
                            <li key={request.id} className="bg-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                <h3 className="text-lg font-semibold text-blue-400">{request.customerName}</h3>
                                <p className="text-gray-300">Service Type: <span className="font-medium">{request.serviceType}</span></p>
                                <p className="text-gray-300">Status: <span className={`font-medium ${request.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>{request.status}</span></p>
                                <p className="text-gray-300">Date: <span className="font-medium">{new Date(request.date).toLocaleDateString()}</span></p>
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
    technicianName: Proptypes.string.isRequired,
    serviceRequests: Proptypes.arrayOf(Proptypes.object).isRequired,
};

export default TechnicianServiceRequests;