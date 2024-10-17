// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MakePayment = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://0.0.0.0:5000/payments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phoneNumber: phoneNumber,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Payment created successfully! ID: ${data.id}`);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail || 'Failed to create payment'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the payment.');
    } finally {
      setShowMessage(true); // Show message after submission
    }
  };

  // Automatically hide the message after a few seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <motion.div
      className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-md mx-auto mt-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h1 className="text-3xl font-bold mb-4 text-white">Make M-Pesa Payment</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="amount" className="block text-sm font-medium text-white">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-700 rounded p-2 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-white">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border border-gray-700 rounded p-2 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <motion.button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit Payment
        </motion.button>
      </form>
      {message && (
        <p className={`mt-4 p-2 bg-blue-500 text-white rounded-md transition-opacity duration-500 ${showMessage ? 'opacity-100' : 'opacity-0'}`}>
          {message}
        </p>
      )}
    </motion.div>
  );
};

export default MakePayment;
