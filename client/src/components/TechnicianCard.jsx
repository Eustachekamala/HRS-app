// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

const TechnicianList = ({ technicians = [] }) => {
    if (!technicians.length) {
        return <p className="text-gray-400">No technicians available.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map(technician => (
                <div key={technician.id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    <img
                        src={`http://0.0.0.0:5000/uploads/${technician.image_path}`}
                        alt={technician.username}
                        className="rounded-lg mb-2 object-cover h-48 w-full"
                    />
                    <h2 className="text-xl font-semibold text-white">{technician.username}</h2>
                    <p className="text-gray-300">{technician.occupation}</p>
                    {technician.description && (
                        <p className="text-gray-400">{technician.description}</p>
                    )}
                    <p className="text-gray-400">Phone: {technician.phone}</p>
                    <p className="text-gray-400">Email: {technician.email}</p>
                </div>
            ))}
        </div>
    );
};

TechnicianList.propTypes = {
    technicians: PropTypes.array,
};

export default TechnicianList;
