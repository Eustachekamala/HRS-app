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
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="serviceType">Service Type</label>
                <input
                    id="serviceType"
                    name="serviceType"
                    type="text"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit">Submit Request</button>
        </form>
    );
};

export default ServiceRequestForm;
