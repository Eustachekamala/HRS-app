import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const ManageTechnicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await axios.get('/technicians');
                setTechnicians(response.data);
            } catch (err) {
                console.error('Error fetching technicians:', err);
                setError('Failed to fetch technicians');
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicians();
    }, []);

    const handleDelete = async (technicianId) => {
        try {
            await axios.delete(`/technicians/${technicianId}`);
            setTechnicians(technicians.filter(technician => technician.id !== technicianId));
            alert('Technician deleted successfully!');
        } catch (err) {
            console.error('Error deleting technician:', err);
            alert('Failed to delete technician');
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-white mb-4">Manage Technicians</h2>
            
            {loading ? (
                <p className="text-gray-500">Loading technicians...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="w-full table-auto text-white">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-4 py-2">Technician ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {technicians.map((technician) => (
                            <tr key={technician.id} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                                <td className="border px-4 py-2">{technician.id}</td>
                                <td className="border px-4 py-2">{technician.name}</td>
                                <td className="border px-4 py-2">{technician.email}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(technician.id)}
                                        className="flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded transition"
                                    >
                                        <FaTrash className="mr-2" /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageTechnicians;