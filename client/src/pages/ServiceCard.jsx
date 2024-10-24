// src/components/ServiceCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service, showButton, onRequestService }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const descriptionLimit = 100; // Limit for initial description length
    const navigate = useNavigate();

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    // Construct image URL, removing 'uploads/' prefix if necessary
    const imageUrl = service.image_path ? `http://127.0.0.1:5000/uploads/${service.image_path.replace(/^uploads\//, '')}` : '';

    return (
        <div className="flex flex-col justify-between border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800">
            <h3 className="text-lg font-semibold text-white">{service.service_type}</h3>
            <p className="mt-1 text-gray-300 text-sm">
                {isExpanded ? service.description : `${service.description.substring(0, descriptionLimit)}...`}
            </p>
            {service.description.length > descriptionLimit && (
                <button onClick={toggleExpand} className="text-blue-500 mt-2">
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            )}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={service.service_type}
                    className="mt-2 border border-gray-700 rounded-lg h-72 object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                    }}
                />
            )}
            {showButton && (
                <button 
                    onClick={() => onRequestService(service.id)} 
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded transition-transform transform hover:scale-105 shadow-md"
                >
                    Request a Service
                </button>
            )}
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
    showButton: PropTypes.bool,
    onRequestService: PropTypes.func.isRequired,
};

ServiceCard.defaultProps = {
    showButton: true,
};

export default ServiceCard;