import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state
        setMessage(''); // Reset message state

        try {
            await axios.post('/api/forgot-password', { email });
            setMessage("Check your email for reset instructions.");
        } catch (error) {
            console.error("Error sending reset email:", error);
            setError("Failed to send reset email. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 ">
            <form onSubmit={handleSubmit} className="bg-blue-600 p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Forgot Password</h2>
                {message && <p className="text-green-500 text-sm text-center">{message}</p>} {/* Success message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Error message */}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="border border-gray-300 p-3 w-full mb-4 rounded"
                />
                <button type="submit" className="bg-dark-blue text-white px-6 py-3 rounded w-full hover:bg-blue-700 transition">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;