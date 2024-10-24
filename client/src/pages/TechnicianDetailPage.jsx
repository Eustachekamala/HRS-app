import React from 'react';
import { useParams } from 'react-router-dom'; 

const TechnicianDetailPage = () => {
    const { id } = useParams(); // Get technician ID from the URL
    // Fetch technician details based on ID (not shown here)
    
    // Example technician data (replace with actual fetch)
    
    const technician = {
        id,
        username: "Jared",
        email: "jared@example.com",
        phone: "+254-719-405-006",
        occupation: "Plumber",
        history: ["Electrical repair", "Plumbing"],
        realizations: 15,
        image_path: "uploads/jared.jpg"
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold text-white mb-6">{technician.username}</h1>
            <img src={`http://127.0.0.1:5000/uploads/${technician.image_path.replace(/^uploads\//, '')}`} alt={technician.username} className="w-32 h-32 rounded-full mb-4" />
            <p className="text-white">Occupation: {technician.occupation}</p>
            <p className="text-white">Email: {technician.email}</p>
            <p className="text-white">Phone: {technician.phone}</p>
            <p className="text-white">Realizations: {technician.realizations}</p>
            <p className="text-white">History: {technician.history.join(', ')}</p>
        </div>
    );
};

export default TechnicianDetailPage;