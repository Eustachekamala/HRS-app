import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceCard from '../pages/ServiceCard';
import ServiceRequestForm from '../components/ServiceRequestForm';

const ServiceList = ({ showButton }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/services');
                setServices(response.data.services);
            } catch (err) {
                setError('Failed to fetch services');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleRequestService = (serviceId, serviceType) => {
        setSelectedServiceType(serviceType);
        setSelectedServiceId(serviceId);
        setIsRequestFormOpen(true); 
    };

    const closeRequestForm = () => {
        setIsRequestFormOpen(false);
        setSelectedServiceType('');
        setSelectedServiceId('');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-gray-500">Loading...</p>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-red-600">{error}</p>
        </div>
    );

    const displayedServices = showAllServices ? services : services.slice(0, 4);

    return (
        <div className="container bg-gray-900 mx-auto p-4">
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-5xl py-5 font-bold text-white'>Our Services</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedServices.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            showButton={showButton}
                            onRequestService={(serviceId) => handleRequestService(serviceId, service.service_type)}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setShowAllServices(!showAllServices)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-blue-700"
                >
                    {showAllServices ? 'See Less Services' : 'See More Services'}
                </button>
            </div>
                
            {isRequestFormOpen && (
                <ServiceRequestForm
                    serviceType={selectedServiceType}
                    serviceId={selectedServiceId}
                    onClose={closeRequestForm} 
                />
            )}
        </div>
    );
};

export default ServiceList;
