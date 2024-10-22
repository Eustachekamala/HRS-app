import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTechnician = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [occupation, setOccupation] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [history, setHistory] = useState('');
    const [realizations, setRealizations] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const technicianData = new FormData();
        technicianData.append('username', username);
        technicianData.append('email', email);
        technicianData.append('phone', phone);
        technicianData.append('occupation', occupation);
        technicianData.append('image', imageFile);
        technicianData.append('history', history);
        technicianData.append('realizations', realizations);

        try {
            const response = await axios.post('https://hrs-app-1.onrender.com/technicians', technicianData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            console.log(response);
            setSuccess('Technician added successfully!');
            // Redirect to another page if needed
            navigate('/technician-list');
            // Reset the form fields
            setUsername('');
            setEmail('');
            setPhone('');
            setOccupation('');
            setImageFile(null);
            setHistory('');
            setRealizations(0);
        } catch (err) {
            console.error('Error adding technician:', err);
            setError('Failed to add technician. Please try again.');
        }
    };

    return (
        <div className="flex flex-col text-white justify-center items-center h-screen bg-gray-950">
            <div className="bg-black bg-opacity-90 flex flex-col w-full max-w-md mx-auto p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Add Technician</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        required
                        className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                    />
                    <div className="mb-4">
                        <label className="block text-white mb-1">Upload Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="border border-gray-300 bg-gray-700 rounded-md p-3 w-full"
                            accept="image/*"
                        />
                    </div>
                    <textarea
                        placeholder="History"
                        value={history}
                        onChange={(e) => setHistory(e.target.value)}
                        className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                        rows="4"
                    />
                    <input
                        type="number"
                        placeholder="Realizations"
                        value={realizations}
                        onChange={(e) => setRealizations(e.target.value)}
                        className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                        min="0"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        Add Technician
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTechnician;