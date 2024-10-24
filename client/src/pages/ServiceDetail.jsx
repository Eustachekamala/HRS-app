import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceDetail = ({ serviceId }) => {
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/services/${serviceId}`);
                setService(response.data);
            } catch (err) {
                setError('Failed to fetch service details');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>{service.service_type}</h2>
            <p>{service.description}</p>
            {service.image_path && <img src={service.image_path} alt={service.service_type} />}
        </div>
    );
};

export default ServiceDetail;