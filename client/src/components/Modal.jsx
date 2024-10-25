// Modal.js
import React from 'react';
import Proptypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                {children}
                <button onClick={onClose} className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-400 transition">
                    Close
                </button>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: Proptypes.bool.isRequired,
    onClose: Proptypes.func.isRequired,
    title: Proptypes.string.isRequired,
    children: Proptypes.node.isRequired,
};

export default Modal;
