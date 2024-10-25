import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HealthCheckComponent = () => {
    const [healthStatus, setHealthStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHealthStatus = async () => {
            try {
                const response = await axios.get('https://hrs-app-1.onrender.com/health');
                setHealthStatus(response.data);
            } catch (err) {
                setError('Failed to retrieve health status.');
            } finally {
                setLoading(false);
            }
        };

        fetchHealthStatus();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="health-check p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-2xl mb-4">System Health</h2>
            <div className="flex flex-col space-y-2">
                <p><strong>Database:</strong> {healthStatus.database}</p>
                <p><strong>Redis:</strong> {healthStatus.redis}</p>
                <p>{healthStatus.message}</p>
            </div>
        </div>
    );
};

export default HealthCheckComponent;
