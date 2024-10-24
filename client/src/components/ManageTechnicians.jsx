import React, { useEffect, useState } from 'react';
import { fetchTechnicians as fetchTechniciansFromApi } from '../api';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import AddTechnician from './AddTechnician';

const ManageTechnicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddTechnician, setShowAddTechnician] = useState(false);

    useEffect(() => {
        const loadTechnicians = async () => {
            setLoading(true);
            setError(null);
            try {
                const techData = await fetchTechniciansFromApi();
                setTechnicians(techData);
            } catch (err) {
                console.error('Error fetching technicians:', err);
                setError('Failed to fetch technicians');
            } finally {
                setLoading(false);
            }
        };

        loadTechnicians();
    }, []);

    const handleDelete = async (technicianId) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/technicians/${technicianId}`);
            setTechnicians(technicians.filter(technician => technician.id !== technicianId));
            alert('Technician deleted successfully!');
        } catch (err) {
            console.error('Error deleting technician:', err);
            alert('Failed to delete technician');
        }
    };

    const handleAddTechnician = (newTechnician) => {
        setTechnicians([...technicians, newTechnician]);
        setShowAddTechnician(false);
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-white mb-4">Manage Technicians</h2>
            <button onClick={() => setShowAddTechnician(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center mb-4">
                <FaPlus className="mr-2" /> Add Technician
            </button>
            {showAddTechnician && <AddTechnician onAdd={handleAddTechnician} />}
            
            {loading ? (
                <p className="text-gray-500">Loading technicians...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="w-full table-auto text-white">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-4 py-2">Technician ID</th>
                            <th className="px-4 py-2">Username</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {technicians.map((technician) => (
                            <tr key={technician.id} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                                <td className="border px-4 py-2">{technician.id}</td>
                                <td className="border px-4 py-2">{technician.username}</td>
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
