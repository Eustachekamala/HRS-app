import React, { useState, useEffect } from 'react';
import { fetchStatistics as fetchStatisticsFromAPI } from '../api';
import { FaChartLine, FaUsers } from 'react-icons/fa';

const Statistics = () => {
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('No token provided');
                }

                const statsResponse = await fetchStatisticsFromAPI(token);
                setStatistics(statsResponse);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError(error.message || 'Failed to load statistics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div className="h- bg-gray-900 p-6 rounded-lg shadow-md mb-10">
            <h1 className="text-3xl font-bold text-white mb-6">Statistics</h1>
            {loading ? (
                <p className="text-gray-500">Loading statistics...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaChartLine className="text-blue-500 mr-2" />
                            <p className="text-gray-700">{statistics.total_requests || 0} Total Requests</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaUsers className="text-blue-500 mr-2" />
                            <p className="text-gray-700">{statistics.active_technicians || 0} Active Technicians</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;