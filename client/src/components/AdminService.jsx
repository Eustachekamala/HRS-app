import ServiceDisplay from './ServiceDisplay';
import { useState, useEffect } from 'react';
import { fetchServices as fetchServicesFromAPI } from '../api';

function AdminServices() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]);
    const [serviceById, setServiceById] = useState({});

    // Fetch services from the backend
    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchServicesFromAPI();
            if (data.length > 0) {
                setServices(data);
            } else {
                setError('No services available.');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to load services. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchServices(1);
    }, []);

    return (
        <>  
            {loading && <p>Loading services...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ServiceDisplay services={services} serviceById={serviceById} />
            {services.length === 0 && !loading && <p>No services available.</p>}
        </>
    );
}

export default AdminServices;