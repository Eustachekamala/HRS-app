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

        axios.post('/requests', {
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Request Service { serviceType }</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label htmlFor="serviceType">Service Type</label>
                            <input
                                id="serviceType"
                                name="serviceType"
                                type="text"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="description" className="block text-sm font-semibold mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            ></textarea>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                        <button className="w-full mt-2 py-4 px-4 rounded-lg text-blue-600 hover:underline" type="submit">Submit Request</button>
                    </form>
            </div>
        </div>
    );
};

export default ServiceRequestForm;
