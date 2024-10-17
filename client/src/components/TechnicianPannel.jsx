import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TechnicianPanel = () => {
    const [assignedRequests, setAssignedRequests] = useState([]);

    useEffect(() => {
        // Fetch requests assigned to the current logged-in technician
        axios.get('/api/technician-requests').then(response => {
            setAssignedRequests(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Technician Panel</h1>
            <section>
                <h2>Assigned Service Requests</h2>
                <ul>
                    {assignedRequests.map((request) => (
                        <li key={request.id}>
                            {request.description} - Assigned by {request.admin.username}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default TechnicianPanel;
