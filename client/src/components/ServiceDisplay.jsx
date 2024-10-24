// eslint-disable-next-line no-unused-vars
import React, { useState} from 'react';
import PropTypes from 'prop-types';
import ServiceCard from '../pages/serviceCard';
import ServiceRequestForm from './ServiceRequestForm'; 
// Define the ServiceDisplay component
const ServiceDisplay = ({ services }) => {
    const [selectedService, setSelectedService] = useState(null);
    // Check if services is an array and has elements
    if (!Array.isArray(services) || services.length === 0) {
        return <div>No services available</div>;
    }

    // Sort services by service type
    services.sort((a, b) => a.service_type.localeCompare(b.service_type));

    const handleServiceClick = (serviceType) => {
        setSelectedService(serviceType); 
    };

    return (
        <div className="w-full h-full mx-auto p-4 m-0">
            {selectedService && (
                <ServiceRequestForm 
                    serviceType={selectedService} 
                    onClose={() => setSelectedService(null)}
                />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {services.map((service) => (
                    <div key={service.id} onClick={() => handleServiceClick(service.service_type)}>
                        <ServiceCard service={service} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Define the prop types for the ServiceDisplay component
ServiceDisplay.propTypes = {
    services: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            service_type: PropTypes.string.isRequired,
            description: PropTypes.string,
            image_path: PropTypes.string,
        })
    ).isRequired,
};

export default ServiceDisplay;