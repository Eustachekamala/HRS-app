import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the UploadService component
const UploadService = ({ onUploadSuccess, onUploadError}) => {
    const [file, setFile] = useState(null);
    const [serviceType, setServiceType] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle file change
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Validate input fields
    const validateFields = () => {
        if (!file) {
            toast.warning('Please select a file to upload.', { position: "top-center" });
            return false;
        }
        if (!serviceType.trim()) {
            toast.warning('Service name is required.', { position: "top-center" });
            return false;
        }
        if (!description.trim()) {
            toast.warning('Description is required.', { position: "top-center" });
            return false;
        }
        return true;
    };

    // Handle upload
    const handleUpload = async () => {
        if (!validateFields()) return;

        setLoading(true);
        setError(null);

        // Create a FormData object
        const formData = new FormData();
        formData.append('file', file);
        formData.append('service_type', serviceType);
        formData.append('description', description);

        const token = localStorage.getItem('token');
        // Upload the file to the backend
        try {
            const response = await axios.post('https://hrs-app-1.onrender.com/services', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Service created successfully!', { position: "top-center" });
            onUploadSuccess();
            // Reset form fields
            setFile(null);
            setServiceType('');
            setDescription('');
        } catch (err) {
            console.error('Upload failed:', err.response ? err.response.data : err.message);
            onUploadError(err.message);
            setError('Failed to upload service. Please try again.');
            toast.error('Failed to upload service. Please try again.', { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 h-screen flex items-center justify-center">
            <div className="bg-black bg-opacity-90 flex flex-col w-full max-w-md p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-center text-white">Upload Service</h2>
                {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
                <input
                    type="text"
                    placeholder="Service Name"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="border border-gray-300 bg-gray-700 rounded-md p-2 mb-4 w-full text-white"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-300 bg-gray-700 rounded-md p-2 mb-4 w-full text-white"
                    rows="3"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="border border-gray-300 bg-gray-700 rounded-md p-2 mb-4 w-full text-white"
                />
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </div>
    );
};

// Prop types validation
UploadService.propTypes = {
    onUploadSuccess: PropTypes.func.isRequired,
    onUploadError: PropTypes.func.isRequired,
    userToken: PropTypes.string.isRequired,
    adminId: PropTypes.string.isRequired,
};

export default UploadService;
