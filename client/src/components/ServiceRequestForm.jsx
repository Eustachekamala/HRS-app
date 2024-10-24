import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; 

const ServiceRequestForm = ({ serviceType, onClose }) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!serviceType || !description) {
            setError('All fields are required.');
            return;
        }

        axios.post('/requests', {
            service_type: serviceType, // Use the passed serviceType
            description
        })
        .then(response => {
            console.log(response);
            setSuccessMessage('Service request created successfully');
            setDescription('');
        })
        .catch(error => {
            setError('There was an error creating the request. Please try again later.');
            console.error('Error:', error);
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Request Service: {serviceType}</h2>
                <form onSubmit={handleSubmit} className='text-white'>
                    <div className='mb-4'>
                        <label htmlFor="serviceType" className="block text-sm font-semibold mb-2">Service Type</label>
                        <input
                            id="serviceType"
                            name="serviceType"
                            type="text"
                            value={serviceType}
                            readOnly 
                            className="w-full p-2 border text-black border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="description" className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border text-black border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        ></textarea>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <button className="w-full mt-2 bg-blue-500 py-4 px-4 rounded-lg text-white hover:underline" type="submit">Submit Request</button>
                    <button className="w-full mt-2 bg-red-500 py-2 rounded-lg text-white hover:underline" type="button" onClick={onClose}>Close</button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/technician')}
                        className="w-full mt-2 bg-green-500 py-4 px-4 rounded-lg text-white hover:underline"
                    >
                        View Technicians
                    </button>
                </form>
            </div>
        </div>
    );
};

ServiceRequestForm.propTypes = {
    serviceType: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ServiceRequestForm;