// eslint-disable-next-line no-unused-vars
import React from 'react';
import UploadService from './UploadService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUploadPage = () => {
    
    // Handle upload success
    const handleUploadSuccess = () => {
        toast.success('Image uploaded successfully!', { position: "top-center" });
    };

    // Handle upload error
    const handleUploadError = (errorMessage) => {
        toast.error(errorMessage, { position: "top-center" });
    };
    
    return (
        <div className='flex flex-col text-white justify-center items-center h-screen bg-gray-950'>
            <h1 className="text-2xl font-bold mb-5">Admin Upload Page</h1>
            {/* Display the image upload form */}
            <UploadService onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
            {/* Display a toast message */}
            <ToastContainer position='top-center' autoClose={3000} />
        </div>
    );
};

export default AdminUploadPage;
