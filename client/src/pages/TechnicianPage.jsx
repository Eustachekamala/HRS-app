import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TechnicianList from '../components/TechnicianList';

const TechnicianPage = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTechnicians = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://0.0.0.0:5000/technician', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                // Assuming the API response structure
                setTechnicians(response.data.technicians || []);
            } catch (err) {
                console.error('Error fetching technicians:', err);
                setError('Failed to load technicians. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicians();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <h1 className="text-3xl font-bold text-center text-white mb-4">Our Technicians</h1>
            {loading && <p className="text-center text-white">Loading technicians...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && technicians.length > 0 && (
                <TechnicianList technicians={technicians}  />
            )}
            {!loading && technicians.length === 0 && (
                <p className="text-center text-white">No technicians available.</p>
            )}
        </div>
    );
};

export default TechnicianPage;
