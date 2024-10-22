import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const descriptionLimit = 100;
    const navigate = useNavigate();

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    // Ensure image_path does not have 'uploads/' prefix
    const imageUrl = `https://hrs-app-1.onrender.com/uploads/${service.image_path.replace(/^uploads\//, '')}`;

    const handleRequestService = () => {
        // Navigate to the ServiceRequestForm
        navigate('/service-request-form', { state: { serviceId: service.id } });
    };

    return (
        <div className="flex flex-col justify-between border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800">
            <h3 className="text-lg font-semibold text-white">{service.service_type}</h3>
            <p className="mt-1 text-gray-300 text-sm">
                {isExpanded ? service.description : `${service.description.substring(0, descriptionLimit)}...`}
            </p>
            {service.description && service.description.length > descriptionLimit && (
                <button onClick={toggleExpand} className="text-blue-500 mt-2">
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            )}
            {service.image_path && (
                <img
                    src={imageUrl}
                    alt={service.service_type}
                    className="mt-2 border border-gray-700 rounded-lg h-72 object-cover"
                    onError={(e) => {
                        e.target.onerror = null; // Prevents looping
                        // e.target.src = 'path/to/placeholder/image.jpg'; 
                    }}
                />
            )}
            <button 
                onClick={handleRequestService} 
                className='py-4 px-4 bg-blue-500 text-white rounded-lg mt-4'
            >
                Request Service
            </button>
        </div>
    );
};

ServiceCard.propTypes = {
    service: PropTypes.shape({
        id: PropTypes.number.isRequired,
        service_type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image_path: PropTypes.string,
    }).isRequired,
};

export default ServiceCard;