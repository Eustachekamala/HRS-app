import ServiceDisplay from './ServiceDisplay';
import axios from 'axios';
import { useState, useEffect } from 'react';

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
            const response = await axios.get('http://0.0.0.0:5000/services');
            setServices(response.data.services || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to load services. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch a service by id from the backend
    const fetchService = async (serviceId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://0.0.0.0:5000/services/${serviceId}`);
            
            if (response.data) { 
                setServiceById(response.data);
            } else {
                throw new Error('Service not found');
            }
        } catch (error) {
            console.error('Error fetching service:', error);
            if (error.response) {
                setError(`Error: ${error.response.status} - ${error.response.data.error || 'Service not found.'}`);
            } else if (error.request) {
                setError('No response from the server. Please check your connection.');
            } else {
                setError('Error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchService(1);
    }, []);

    return (
        <>  
            {/* Display the services */}
            {loading && <p>Loading services...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ServiceDisplay services={services} serviceById={serviceById} />
        </>
    );
}

export default AdminServices;
