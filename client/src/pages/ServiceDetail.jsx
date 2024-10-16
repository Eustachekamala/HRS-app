// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/services/${id}`);
                setService(response.data.service);
            } catch (err) {
                setError(err.response ? err.response.data : 'Service not found');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            service_request_id: service.id,
            request: userInfo
        };

        try {
            await axios.post('http://localhost:5000/services/request', payload);
            toast.success('Request submitted successfully!');
            setUserInfo({ name: '', email: '', phone: '', message: '' }); // Reset form
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-white text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!service) return <div className="text-white text-center">No service details available</div>;

    return (
        <div className='w-full min-h-screen bg-gray-900 flex flex-col items-center'>
            <div className="flex flex-col justify-between w-full h-auto border border-gray-700 rounded-lg shadow-md p-6 mx-auto max-w-2xl">
                <h3 className="text-2xl font-semibold text-white">{service.service_type}</h3>
                <p className="mt-2 text-gray-300">{service.description}</p>
                {service.image_path && (
                    <img
                        src={`http://localhost:5000/${service.image_path}`}
                        alt={service.service_type}
                        className="mt-4 border border-gray-700 rounded-lg object-cover h-48 w-full"
                    />
                )}
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
                >
                    Back to Services
                </button>

                {/* Request Form Section */}
                <div className="h-full bg-gray-800 rounded-lg mt-6">
                    <h4 className="text-xl font-semibold text-white">Request More Information</h4>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={userInfo.name}
                            onChange={handleInputChange}
                            className="border border-gray-600 p-2 w-full rounded-lg bg-gray-900 text-white"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            className="border border-gray-600 p-2 w-full rounded-lg bg-gray-900 text-white"
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Your Phone Number"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                            className="border border-gray-600 p-2 w-full rounded-lg bg-gray-900 text-white"
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={userInfo.message}
                            onChange={handleInputChange}
                            className="border border-gray-600 p-2 w-full rounded-lg bg-gray-900 text-white"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
                <ToastContainer position='top-center' autoClose={3000} />
            </div>
        </div>
    );
};

export default ServiceDetail;
