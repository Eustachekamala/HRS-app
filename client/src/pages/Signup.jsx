import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user');
    const [adminCode, setAdminCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await signup(email, password, username, phone, role, role === 'admin' ? adminCode : null);
            const { success, error } = response;

            if (success) {
                navigate('/login');
            } else {
                setError(error || 'Signup failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', background: 'linear-gradient(to bottom right, #1a1a1a, #4d4d4d)' }} className="flex flex-col md:flex-row text-white justify-center items-center">
            <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-4'>
                <h1 className='text-4xl md:text-5xl font-bold mb-2 text-center'>
                    Sign Up Today!
                </h1>
                <p className='text-lg max-w-md text-center mb-6'>
                    Unlock exclusive features and experiences tailored just for you. It only takes a moment to create an account and start your journey with us.
                </p>
            </div>
            <div className="bg-black bg-opacity-90 flex flex-col w-full md:w-1/2 max-w-md mx-auto p-6 rounded-lg shadow-md">
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
                        <select 
                            value={role} 
                            onChange={(e) => {
                                setRole(e.target.value);
                                if (e.target.value === 'user') {
                                    setAdminCode('');
                                }
                            }} 
                            className="border text-blue-500 border-gray-300 p-3 w-full mb-4 rounded"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        
                        {role === 'admin' && (
                            <input 
                                type="password"
                                placeholder="Admin Code" 
                                value={adminCode} 
                                onChange={(e) => setAdminCode(e.target.value)} 
                                className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                                required 
                            />
                        )}

                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md hover:bg-blue-700 transition duration-200">
                            {loading ? 'Signing up...' : 'Signup'}
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
