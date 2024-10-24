import React, { useState } from 'react';
import axios from 'axios';

const AddTechnician = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [occupation, setOccupation] = useState('');
    const [image_path, setImagePath] = useState(null);
    const [history, setHistory] = useState('');
    const [realizations, setRealizations] = useState(0);

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
        if (image_path) {
            formData.append('image_path', image_path);
        }
        formData.append('occupation', occupation);
        formData.append('history', history);
        formData.append('realizations', realizations);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://127.0.0.1:5000/technicians', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
                setImagePath(null);
                setOccupation('');
                setHistory('');
                setRealizations(0);
            }
        } catch (error) {
            setMessage('Error adding technician. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-4 bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">Add Technician</h2>
                {message && <p className="text-red-500 text-center">{message}</p>}
                <form onSubmit={handleSubmit}>
                    {[
                        { label: "Username", value: username, setValue: setUsername, type: "text" },
                        { label: "Email", value: email, setValue: setEmail, type: "email" },
                        { label: "Password", value: password, setValue: setPassword, type: "password" },
                        { label: "Phone", value: phone, setValue: setPhone, type: "tel" },
                        { label: "Occupation", value: occupation, setValue: setOccupation, type: "text" },
                        { label: "Realizations", value: realizations, setValue: setRealizations, type: "number" },
                    ].map(({ label, value, setValue, type }, index) => (
                        <div key={index} className="mb-3">
                            <label className="block text-gray-300" htmlFor={label.toLowerCase()}>{label}</label>
                            <input
                                type={type}
                                id={label.toLowerCase()}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                required
                                className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <div className="mb-3">
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
                    <div className="mb-3">
                        <label className="block text-gray-300" htmlFor="image_path">Upload Image</label>
                        <input
                            type="file"
                            id="image_path"
                            onChange={(e) => setImagePath(e.target.files[0])}
                            accept="image/*"
                            required
                            className="w-full p-2 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-3"> 
                        <label className="block text-gray-300" htmlFor="history">History</label>
                        <textarea
                            id="history"
                            value={history}
                            onChange={(e) => setHistory(e.target.value)}
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
