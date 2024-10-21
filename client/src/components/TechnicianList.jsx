import React from 'react';
import Proptypes from 'prop-types';

const TechnicianList = ({ technicians, onSelectTechnician}) => {
    return (
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Available Technicians</h2>
            <div className="w-full max-w-2xl">
                {technicians.length > 0 ? (
                    <ul className="space-y-4">
                        {technicians.map((technician) => (
                            <li 
                                key={technician.id} 
                                className="bg-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer flex items-center"
                                onClick={() => onSelectTechnician(technician)}
                            >
                                <img 
                                    src={technician.image_path}
                                    alt={technician.username}
                                    className="w-16 h-16 rounded-full mr-4 shadow-lg" 
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-blue-400">{technician.username}</h3>
                                    <h2 className='text-lg font-semibold text-white'>{technician.occupation}</h2>
                                    <p className='text-white '>{technician.email}</p>
                                    <p className='text-white '>{technician.phone}</p>
                                    {/* <p className="text-gray-300">Realizations: <span className="font-medium">{technician.realizations}</span></p>
                                    <p className="text-gray-300">History: <span className="font-medium">{Array.isArray(technician.history) ? technician.history.join(', ') : 'No history available'}</span></p>
                                    <p className="text-gray-300">Rating: <span className="font-medium text-yellow-400">{technician.rating}</span></p> */}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No technicians available at the moment.</p>
                )}
            </div>
        </div>
    );
};

TechnicianList.propTypes = {
    technicians: Proptypes.arrayOf(Proptypes.object).isRequired,
    onSelectTechnician: Proptypes.func.isRequired,
};

export default TechnicianList;