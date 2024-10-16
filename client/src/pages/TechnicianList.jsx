// eslint-disable-next-line no-unused-vars
import React from 'react';
import TechnicianCard from '../components/TechnicianCard';
import PropTypes from 'prop-types';

const TechnicianList = ({ technicians }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {technicians.map((technician) => (
                <TechnicianCard key={technician.id} technician={technician} />
            ))}
        </div>
    );
};

TechnicianList.propTypes = {
    technicians: PropTypes.array.isRequired,
};

export default TechnicianList;
