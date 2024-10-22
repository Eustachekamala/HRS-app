// src/PayPalButton.js
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = () => {
    const [amount, setAmount] = useState("100.00"); // Default value

    const handleApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            alert(`Transaction completed by ${details.payer.name.given}`);
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <PayPalScriptProvider
                options={{
                    "client-id": "AQJnKGofUdV1yyAdRB9Q7t-C6ismrFQ1rQqesmADh96wi_FBSzi9kNZHPy2VTha4FGN-s0L8RxUQhDSp",
                }}
            >
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full transition-transform transform hover:scale-105">
                    <h2 className="text-2xl font-bold mb-4 text-white">PayPal Payment</h2>
                    {/* Input field for amount */}
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-white mb-2">Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        />
                    </div>
                    <PayPalButtons
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: amount,
                                    },
                                }],
                            });
                        }}
                        onApprove={handleApprove}
                        style={{
                            layout: 'vertical',
                            color: 'blue',
                            label: 'paypal',
                            tagline: false,
                        }}
                    />
                </div>
            </PayPalScriptProvider>
        </div>
    );
};

export default PayPalButton;
