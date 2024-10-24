import React, { useState } from 'react';
import axios from 'axios';

const AddTechnician = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        image_path: '',
        occupation: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    try {
        const response = await axios.post('http://127.0.0.1:5000/technicians', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setSuccess('Technician added successfully!');
        setError('');
        setFormData({
            username: '',
            password: '',
            email: '',
            phone: '',
            image_path: '',
            occupation: ''
        });
    } catch (err) {
        console.error("Error details:", err.response);
        setError(err.response?.data?.error || 'Failed to add technician.');
        setSuccess('');
    }
};

    return (
        <div className=" mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-white mb-4">Add Technician</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    placeholder="Username" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Phone" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="file" 
                    name="image_path" 
                    value={formData.image_path} 
                    onChange={handleChange} 
                    placeholder="Image Path" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    name="occupation" 
                    value={formData.occupation} 
                    onChange={handleChange} 
                    placeholder="Occupation" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                >
                    Add Technician
                </button>
            </form>
        </div>
    );
};

export default AddTechnician;
