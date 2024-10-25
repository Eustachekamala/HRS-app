import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TechnicianList = ({ onDelete, onEdit }) => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await axios.get('https://hrs-app-1.onrender.com/technicians');
                setTechnicians(response.data.technicians);
            } catch (err) {
                setError('Failed to retrieve technicians.');
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicians();
    }, []);

    const handleDelete = async (id) => {
        try {
            await onDelete(id);
        } catch (error) {
            toast.error('Failed to delete technician.', { position: "top-center" });
        }
    };

    const handleEdit = (tech) => {
        onEdit(tech); 
        toast.info('Editing technician...', { position: "top-center" });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <ToastContainer />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {technicians.map(tech => {
                    const imageUrl = tech.image_path ? 
                        `https://hrs-app-1.onrender.com/uploads/${tech.image_path.replace(/^uploads\//, '')}` : 
                        '';

                    return (
                        <div key={tech.id} className="bg-black opacity-60 p-4 rounded-lg shadow-md">
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={tech.username}
                                    className="mt-2 border border-gray-700 rounded-lg h-36 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                    }}
                                />
                            )}
                            <h3 className="text-xl font-semibold text-white">{tech.username}</h3>
                            <p className="text-gray-300">{tech.email}</p>
                            <p className="text-gray-400">Phone: {tech.phone}</p>
                            <p className="text-gray-400">Occupation: {tech.occupation}</p>
                            <p className="text-gray-400">Realizations: {tech.realizations}</p>

                            <div className="mt-2 flex justify-between">
                                {onEdit && (
                                    <button
                                        onClick={() => handleEdit(tech)}
                                        className="flex justify-center items-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400 transition"
                                    >
                                        <FaEdit className="mr-2" /> Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => handleDelete(tech.id)}
                                        className="flex justify-center items-center bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 transition"
                                    >
                                        <FaTrash className="mr-2" /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

TechnicianList.propTypes = {
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
};

export default TechnicianList;
