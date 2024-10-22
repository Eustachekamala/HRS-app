// src/AddTechnician.jsx

import React, { useState } from 'react';
import axios from 'axios';

const AddTechnician = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [picture, setPicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('phone', phone);
        if (picture) {
            formData.append('picture', picture);
        }

        try {
            const response = await axios.post('/technicians', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                setMessage('Technician added successfully!');
                setUsername('');
                setEmail('');
                setPassword('');
                setRole('');
                setPhone('');
                setPicture(null);
            }
        } catch (error) {
            setMessage('Error adding technician. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">Add Technician</h2>
                {message && <p className="text-red-500 text-center">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300" htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="technician">Technician</option>
                            <option value="support">Support</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300" htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300" htmlFor="picture">Upload Picture</label>
                        <input
                            type="file"
                            id="picture"
                            onChange={(e) => setPicture(e.target.files[0])}
                            accept="image/*"
                            required
                            className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Technician'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTechnician;