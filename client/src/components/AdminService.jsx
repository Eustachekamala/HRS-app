import ServiceDisplay from './ServiceDisplay';
import axios from 'axios';
import { useState, useEffect } from 'react';

function AdminServices() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]);
    const [serviceById, setServiceById] = useState({});

    // Helper function to get token from local storage
    const getToken = () => localStorage.getItem('token');

    // Fetch services from the backend
    const fetchServices = async () => {
        const token = getToken();
        if (!token) {
            console.error('No token found');
            setError('Unauthorized access. Please log in.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://0.0.0.0:5000/services', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setServices(response.data.services || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to load services. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch a service by id from the backend
    const fetchService = async (id) => {
        const token = getToken();
        if (!token) {
            console.error('No token found');
            setError('Unauthorized access. Please log in.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://0.0.0.0:5000/services/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
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
