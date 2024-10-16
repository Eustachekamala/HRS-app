import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ServiceDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [service, setService] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5000/services/${id}`);
                console.log(response.data);
                setService(response.data.service);
            } catch (error) {
                console.error('Error fetching service:', error);
                if (error.response) {
                    setError(`Error: ${error.response.status} - ${error.response.data.error || 'Service not found.'}`);
                } else {
                    setError('Error: ' + error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
                {loading && <p className="text-white text-center">Loading service...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {service && (
                    <div className="text-white">
                        <h2 className="text-3xl font-semibold mb-4">{service.service_type}</h2>
                        <p className="mb-4">{service.description}</p>
                        {service.image_path && (
                            <>
                                <p>Image Path: {service.image_path}</p>
                                <img
                                    src={`http://localhost:5000/${service.image_path}`}
                                    alt={service.service_type}
                                    className="rounded-lg mb-4 object-cover h-48 w-full"
                                />
                            </>
                        )}
                        <button
                            onClick={() => window.history.back()}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Back to Services
                        </button>
                    </div>
                )}
                <ToastContainer position='top-center' autoClose={3000} />
            </div>
        </div>
    );
}

export default ServiceDetail;
