import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user'); // Default role is set here
    const [adminCode, setAdminCode] = useState(''); // State for Admin-specific input
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        setError(''); // Reset error before submission

        try {
            // Send the role and admin code (if applicable) along with other signup data
            const response = await signup(email, password, username, phone, role, role === 'admin' ? adminCode : null);
            console.log(response); // Log response for debugging
            
            const { success, error } = response; // Destructure response

            if (success) {
                // After successful signup, navigate to login page
                navigate('/login'); 
            } else {
                setError(error || 'Signup failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false); // Set loading to false after API call
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
                            onChange={(e) => {
                                setRole(e.target.value);
                                if (e.target.value === 'user') {
                                    setAdminCode(''); // Reset admin code when switching to user
                                }
                            }} 
                            className="border text-blue-500 border-gray-300 p-3 w-full mb-4 rounded"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        
                        {/* Conditional Rendering for Admin Role */}
                        {role === 'admin' && (
                            <input 
                                type="text" 
                                placeholder="Admin Code" 
                                value={adminCode} 
                                onChange={(e) => setAdminCode(e.target.value)} 
                                className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                                required // Set required if you want to enforce this field
                            />
                        )}

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
