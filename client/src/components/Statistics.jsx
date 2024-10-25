// Statistics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = () => {
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('https://hrs-app-1.onrender.com/statistic');
                setStatistics(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return <p className="text-gray-500">Loading statistics...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error.message}</p>;
    }

    return (
        <div className="mb-6 p-4 text-white">
            <ul className="list-disc list-inside">
                {/* Render statistics data here */}
                <li>Total Users: {statistics.total_users}</li>
                <li>Total Technicians: {statistics.active_technicians}</li>
                <li>Total Requests: {statistics.total_requests}</li>
                <li>Total Services Offered: {statistics.total_services}</li>
            </ul>
        </div>
    );
};

export default Statistics;
