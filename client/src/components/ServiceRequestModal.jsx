import React, { useState } from 'react';
import axios from 'axios';

const ServiceRequestModal = ({ isOpen, onClose, serviceType, token }) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!description) {
            setError('Description is required.');
            return;
        }

        try {
            const response = await axios.post(
                'https://hrs-app-1.onrender.com/technician_requests',
                {
                    service_type: serviceType,
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the JWT token here
                    },
                }
            );

            setSuccessMessage('Service request created successfully');
            setDescription(''); // Clear the description
            onClose(); // Close the modal
        } catch (error) {
            // Check if the error response is due to an invalid JWT
            if (error.response && error.response.data.message === 'Invalid JWT format. Please log in again.') {
                setError('Your session has expired. Please log in again.');
            } else {
                setError('There was an error creating the request. Please try again later.');
            }
            console.error('Error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Request {serviceType}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            id="description"
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
                    <button type="button" onClick={onClose} className="w-full mt-2 text-blue-600 hover:underline">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ServiceRequestModal;
