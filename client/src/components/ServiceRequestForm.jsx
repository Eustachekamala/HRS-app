import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const ServiceRequestForm = ({ serviceType, serviceId, onClose }) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwt');

        // Function to validate JWT format
        const isValidJWT = (token) => {
            return token && token.split('.').length === 3; 
        };

        // Validate the JWT
        if (!isValidJWT(token)) {
            setError('Invalid JWT format. Please log in again.'); 
            return; 
        }
        try {
            // Check if the token is valid before making the request
            if (!token || !/^Bearer\s[0-9a-zA-Z\-._~+/]+=*$/.test(token)) {
                throw new Error('Invalid token format. Please log in again.');
            }

            const response = await axios.post('https://hrs-app-1.onrender.com/requests', {
                user_id: userId,
                service_id: serviceId,
                description,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            alert(response.data.message);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while submitting the request.');
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-300 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4 text-center">Request a Service</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form>
                    <label className="block mb-4">
                        <span className="font-medium">Service Type:</span>
                        <input
                            type="text"
                            value={serviceType}
                            readOnly
                            className="block w-full border border-gray-300 rounded mt-1 p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="font-medium">Description:</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full border border-gray-300 rounded mt-1 p-2"
                            rows="4"
                            required
                        ></textarea>
                    </label>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit Request
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-black px-4 py-2 rounded transition duration-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ServiceRequestForm.propTypes = {
    serviceType: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    serviceId: PropTypes.number.isRequired,
};

export default ServiceRequestForm;
