// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import ServiceCard from '../pages/serviceCard';

// Define the ServiceDisplay component
const ServiceDisplay = ({ services }) => {
    // Check if services is an array and has elements
    if (!Array.isArray(services) || services.length === 0) {
        return <div>No services available</div>;
    }

    // Sort services by service type
    services.sort((a, b) => a.service_type.localeCompare(b.service_type));

    return (
        <div className="w-full mx-auto p-4 m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
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