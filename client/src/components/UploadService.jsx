// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the ImageUpload component
const UploadService = ({ onUploadSuccess, onUploadError, token }) => {
    const [file, setFile] = useState(null);
    const [service_type, setService_type] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle file change
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Handle upload
    const handleUpload = async () => {
        if (!file || !service_type.trim() || !description.trim()) {
            toast.warning('Please fill in all fields and select a file to upload.', { position: "top-center" });
            setError('Please fill in all fields and select a file');
            return;
        }

        setLoading(true);
        setError(null);

        // Create a FormData object
        const formData = new FormData();
        formData.append('file', file);
        formData.append('service_type', service_type);
        formData.append('description', description);

        // Upload the file to the backend
        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload successful:', response.data);
            onUploadSuccess();
            setFile(null);
            setService_type('');
            setDescription('');
        } catch (err) {
            console.error('Upload failed:', err.response ? err.response.data : err.message);
            onUploadError(err.message);
            setError('Failed to upload image. Please try again.');
            // toast.error('Failed to upload image. Please try again.', { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black bg-opacity-90 flex flex-col w-full max-w-md mx-auto p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Upload Image</h2>
            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
            <input
                type="text"
                placeholder="Service Name"
                value={service_type}
                onChange={(e) => setService_type(e.target.value)}
                className="border border-gray-300 bg-gray-700 rounded-md p-2 mb-4 w-full"
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 bg-gray-700 rounded-md p-2 mb-4 w-full"
                rows="3"
            />
            <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 bg-gray-700 rounded-md p-2 mb-4 w-full"
            />
            <button
                onClick={handleUpload}
                disabled={loading}
                className={`bg-blue-600 text-white px-4 py-2 rounded-md w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

// Prop types validation
UploadService.propTypes = {
    onUploadSuccess: PropTypes.func.isRequired,
    onUploadError: PropTypes.func.isRequired,
    token: PropTypes.string, // Pass the token as a prop if needed
};

export default UploadService;
