import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import AddTechnician from '../pages/AddTechnician';
import TechnicianList from './TechnicianList';
import { FaArrowLeft } from 'react-icons/fa';

const ManageTechnicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddTechnician, setShowAddTechnician] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState(null);

     const handleEdit = (technician) => {
        setSelectedTechnician(technician);
    };
    
    useEffect(() => {
        const loadTechnicians = async () => {
            setLoading(true);
            setError('');
            try {
                const techData = await axios.get('https://hrs-app-1.onrender.com/technicians');
                setTechnicians(techData.data.technicians);
            } catch (err) {
                setError('Failed to fetch technicians');
            } finally {
                setLoading(false);
            }
        };

        loadTechnicians();
    }, []);

    const handleDeleteTechnician = async (technicianId) => {
    try {
        await axios.delete(`https://hrs-app-1.onrender.com/technicians/${technicianId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        // Handle successful deletion (e.g., update UI)
    } catch (error) {
        console.error('Error deleting technician:', error);
    }
};


    const handleAddTechnician = (newTechnician) => {
        setTechnicians([...technicians, newTechnician]);
        setShowAddTechnician(false);
    };

    const toggleAddTechnician = () => {
        setShowAddTechnician(prev => !prev);
    };

    return (
        <div className='bg-gray-900 min-h-screen'>
            <div className="bg-gray-900 p-6 shadow-md">
            <button onClick={() => window.location.href = '/admin-dashboard'} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center mb-4">
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
                <h2 className="text-2xl font-semibold text-white mb-4">Manage Technicians</h2>
                <button onClick={toggleAddTechnician} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center mb-4">
                    <FaPlus className="mr-2" /> {showAddTechnician ? 'Close Form' : 'Add Technician'}
                </button>
                {showAddTechnician && <AddTechnician onAdd={handleAddTechnician} />}
                
                {loading ? (
                    <p className="text-gray-500">Loading technicians...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <TechnicianList onDelete={handleDeleteTechnician} onEdit={handleEdit} />
                )}
            </div>
        </div>
    );
};

export default ManageTechnicians;
