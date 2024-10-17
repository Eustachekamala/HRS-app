// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const descriptionLimit = 100;

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleRequestService = () => {
        navigate(`/service/${service.id}`);
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
                    src={`http://0.0.0.0:5000/uploads/${service.image_path}`}
                    alt={service.service_type}
                    className="mt-2 border border-gray-700 rounded-lg h-72 object-cover"
                />
            )}
            <button
                onClick={handleRequestService}
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
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
        description: PropTypes.string,
        image_path: PropTypes.string,
    }).isRequired,
};

export default ServiceCard;
