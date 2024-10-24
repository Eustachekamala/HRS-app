import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TechnicianList = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/technicians');
                setTechnicians(response.data.technicians);
            } catch (err) {
                setError('Failed to retrieve technicians.');
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicians();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Technicians</h2>
            <ul>
                {technicians.map(tech => (
                    <li key={tech.id}>
                        {tech.username} - {tech.occupation}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TechnicianList;
