import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, technician, onSave }) => {
    if (!isOpen) return null;

    const handleSave = () => {
        // Handle save logic here, e.g., send updated data to the API
        onSave(technician);
        onClose(); // Close the modal after saving
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Edit Technician</h2>
                <input
                    type="text"
                    value={technician.username}
                    onChange={(e) => (technician.username = e.target.value)} 
                    className="border p-2 mb-4 w-full"
                    placeholder="Username"
                />
                <input
                    type="email"
                    value={technician.email}
                    onChange={(e) => (technician.email = e.target.value)}
                    className="border p-2 mb-4 w-full"
                    placeholder="Email"
                />
                <input
                    type="text"
                    value={technician.phone}
                    onChange={(e) => (technician.phone = e.target.value)}
                    className="border p-2 mb-4 w-full"
                    placeholder="Phone"
                />
                <input
                    type="text"
                    value={technician.occupation}
                    onChange={(e) => (technician.occupation = e.target.value)}
                    className="border p-2 mb-4 w-full"
                    placeholder="Occupation"
                />
                <input
                    type="text"
                    value={technician.history}
                    onChange={(e) => (technician.history = e.target.value)}
                    className="border p-2 mb-4 w-full"
                    placeholder="History"
                />
                <input
                    type="text"
                    value={technician.realizations}
                    onChange={(e) => (technician.realizations = e.target.value)}
                    className="border p-2 mb-4 w-full"
                    placeholder="Realizations"
                    required
                />
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    technician: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default Modal;
