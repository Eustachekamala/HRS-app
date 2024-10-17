import React, { useState, useEffect } from 'react';
import ServiceRequestForm from './ServiceRequestForm';
import axios from 'axios';

const UserPanel = () => {
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
        // Fetch the user's own service requests
        axios.get('/api/my-requests').then(response => {
            setUserRequests(response.data);
        });
    }, []);

    return (
        <div>
            <h1>User Panel</h1>
            <section>
                <h2>Make a New Service Request</h2>
                <ServiceRequestForm />
            </section>

            <section>
                <h2>View Past Requests</h2>
                <ul>
                    {userRequests.map((request) => (
                        <li key={request.id}>
                            {request.description} - {request.service.service_type}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default UserPanel;
