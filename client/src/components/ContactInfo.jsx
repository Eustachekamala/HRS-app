
// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

// Define the ContactInfo component
const ContactInfo = ({ userInfo }) => {
    return (
        <div className="mt-6 text-center">
            <h3 className="font-bold">Thank you for your message!</h3>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Message:</strong> {userInfo.message}</p>
        </div>
    );
};

ContactInfo.propTypes = {
    userInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
    }).isRequired,
};

export default ContactInfo;
