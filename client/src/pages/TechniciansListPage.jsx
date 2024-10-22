import React, { useState, useEffect } from 'react';
import TechnicianList from '../components/TechnicianList';
import { useNavigate } from 'react-router-dom'
import { fetchTechnicians } from '../api';

const TechnicianListPage = () => {
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const getTechnicians = async () => {
            try {
                const techniciansData = await fetchTechnicians();
                setTechnicians(techniciansData);
            } catch (error) {
                console.error('Error fetching technicians:', error);
            }
        };

        getTechnicians();
    }, []);

    const handleSelectTechnician = (technician) => {
        setSelectedTechnician(technician);
        console.log('Selected Technician:', technician);
        navigate(`/technician/${technician.id}`);
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Select a Technician</h1>
            <TechnicianList 
                technicians={technicians} 
                onSelectTechnician={handleSelectTechnician} 
            />
        </div>
    );
};

export default TechnicianListPage;