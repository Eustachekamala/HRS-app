import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DescriptionBox = () => {
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');

  const maxChars = 200;

  const handleChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setDescription(e.target.value);
    }
  };

  const handleSubmit = () => {
    setFeedback(`Description submitted: ${description}`);
    setDescription('');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-md mx-auto mt-10 transition-transform transform hover:scale-105"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Describe Your Service</h2>
      <textarea
        value={description}
        onChange={handleChange}
        placeholder="Enter the type of service you want..."
        className="w-full h-32 p-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out mb-4 resize-none"
        aria-label="Service description"
      />
      <div className="text-gray-400 text-sm mb-2">
        {maxChars - description.length} characters remaining
      </div>
      <motion.button
        onClick={handleSubmit}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-300 ease-in-out"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Submit
      </motion.button>
      {feedback && (
        <div className="mt-4 p-2 bg-blue-500 text-white rounded-md">
          {feedback}
        </div>
      )}
    </motion.div>
  );
};

export default DescriptionBox;
