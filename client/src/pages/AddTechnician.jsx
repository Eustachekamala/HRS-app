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
            const response = await axios.post('https://hrs-app-1.onrender.com/technicians', formData, {
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
        <div className="flex flex-col md:flex-row items-center justify-center mb-8 bg-gray-300 rounded-lg">
            {/* Hide this div on small screens */}
            <div className='hidden md:block w-1/2 p-6 rounded-lg'>
                <img src="/formTech.jpg" alt="form" className='w-full h-full rounded-lg object-cover' />
            </div>
            <div className="w-full md:w-1/2 p-6 bg-gray-800 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">Add Technician</h2>
                {message && <p className="text-green-500 text-center">{message}</p>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 w-full">
                    {[
                        { label: "Username", value: username, setValue: setUsername, type: "text" },
                        { label: "Email", value: email, setValue: setEmail, type: "email" },
                        { label: "Password", value: password, setValue: setPassword, type: "password" },
                        { label: "Phone", value: phone, setValue: setPhone, type: "tel" },
                        { label: "Occupation", value: occupation, setValue: setOccupation, type: "text" },
                        { label: "Realizations", value: realizations, setValue: setRealizations, type: "number" },
                    ].map(({ label, value, setValue, type }, index) => (
                        <div key={index} className="flex flex-col">
                            <label className="text-gray-300" htmlFor={label.toLowerCase()}>{label}</label>
                            <input
                                type={type}
                                id={label.toLowerCase()}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                required
                                className="p-3 bg-gray-100 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>
                    ))}
                    <div className="flex flex-col">
                        <label className="text-gray-300" htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="p-3 bg-gray-100 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="technician">Technician</option>
                            <option value="support">Support</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-300" htmlFor="image_path">Upload Image</label>
                        <input
                            type="file"
                            id="image_path"
                            onChange={(e) => setImagePath(e.target.files[0])}
                            accept="image/*"
                            required
                            className="p-3 bg-gray-100 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    <div className="flex flex-col col-span-1 md:col-span-2">
                        <label className="text-gray-300" htmlFor="history">History</label>
                        <textarea
                            id="history"
                            value={history}
                            onChange={(e) => setHistory(e.target.value)}
                            required
                            className="p-3 bg-gray-100 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-32" 
                        />
                    </div>
                    <button
                        type="submit"
                        className={`h-14 mx-0 md:mx-24 py-4 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
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
