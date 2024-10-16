import React, { useState, useEffect } from 'react';

const MakePayment = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showMessage, setShowMessage] = useState(false); // State for message visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8000/mpesa/payments/', {
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
    <div className="p-6 max-w-md mx-auto bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Make M-Pesa Payment</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="amount" className="block text-sm font-medium">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded p-2 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border rounded p-2 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 transition-transform transform hover:scale-105"
        >
          Submit Payment
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm transition-opacity duration-500 ${showMessage ? 'opacity-100' : 'opacity-0'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default MakePayment;
