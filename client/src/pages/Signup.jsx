import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the role along with other signup data
            const data = await signup(email, password, username, phone, role);
            
            if (data.is_admin) {
                navigate('/admin'); // Redirect to admin page if admin
            } else {
                navigate('/services'); // Redirect to services page if user
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="flex flex-col text-white justify-center items-center h-screen bg-gray-950">
            <div className="bg-black bg-opacity-90 flex flex-col w-full max-w-md mx-auto p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Create an Account</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
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
                    <div className='flex flex-col items-center justify-center'>
                        {/* Role Selection */}
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            className="border text-blue-500 border-gray-300 p-3 w-full mb-4 rounded"
                        >
                            <option value="user">User </option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md hover:bg-blue-700 transition duration-200">
                            Signup
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-gray-300">
                    Already have an account? 
                    <a href="/login" className="text-blue-300 hover:underline"> Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;