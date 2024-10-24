import React, { useState } from 'react';
import axios from 'axios';

const ServiceForm = ({ onSuccess }) => {
    const [serviceType, setServiceType] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('service_type', serviceType);
        formData.append('description', description);
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/services', formData);
            onSuccess(response.data.service);
            // Reset form fields or redirect as necessary
        } catch (err) {
            console.log(err)
            setError('Failed to create service');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
                placeholder="Service Type"
                required
            />
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                required
            />
            <button type="submit">Create Service</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default ServiceForm;