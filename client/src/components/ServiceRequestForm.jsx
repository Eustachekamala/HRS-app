import React, { useState } from 'react';
import axios from 'axios';

const ServiceRequestForm = () => {
    const [serviceType, setServiceType] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!serviceType || !description) {
            setError('All fields are required.');
            return;
        }

        axios.post('/api/user-requests', {
            service_type: serviceType,
            description
        })
        .then(response => {
            setSuccessMessage('Service request created successfully');
            setServiceType('');
            setDescription('');
        })
        .catch(error => {
            setError('There was an error creating the request. Please try again later.');
            console.error('Error:', error);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="serviceType" className="block text-sm font-semibold mb-2">Service Type</label>
                <input
                    id="serviceType"
                    name="serviceType"
                    type="text"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                ></textarea>
            </div>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
                Submit Request
            </button>
        </form>
    );
};

export default ServiceRequestForm;