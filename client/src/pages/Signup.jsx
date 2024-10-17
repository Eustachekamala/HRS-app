import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role can be 'user'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state

        try {
            await axios.post('/api/signup', { email, password, role }); // Include role in signup request
            alert("Signup successful! Please log in.");
            navigate('/login');
        } catch (err) {
            console.error("Signup failed:", err);
            setError('Signup failed. Please try again.'); // Set error message
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="bg-blue-600 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Create an Account</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="border border-gray-300 p-3 w-full mb-4 rounded"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="border border-gray-300 p-3 w-full mb-4 rounded"
                    />
                    {/* Optional Role Selection */}
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-300 p-3 w-full mb-4 rounded">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="bg-dark-blue text-white py-3 rounded-md w-full hover:bg-blue-700 transition duration-200">
                        Signup
                    </button>
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