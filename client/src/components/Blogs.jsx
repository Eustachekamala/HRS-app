import axios from 'axios';
import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';

// Configure Slick slider settings
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

// Define the Blogs component
function Blogs() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blogs, setBlogs] = useState([]);

    // Fetch blogs from the backend
    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/blogs');
            // Ensure you're setting the correct structure
            setBlogs(response.data.blogs || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setError('Failed to load blogs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-6">
            {/* Display loading and error messages */}
            {loading && <p className="text-white text-center">Loading blogs...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {blogs.length === 0 && !loading && <p className="text-white text-center">No blogs available.</p>}

            <div className="bg-black bg-opacity-80 p-4 rounded-lg">
                {/* Display the slider */}
                <Slider {...settings}>
                    {blogs.map((post) => (
                        <motion.div
                            key={post.id} // Use post.id for a unique key
                            className="border border-gray-700 rounded-lg p-4 bg-gray-900 text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-xl font-semibold">{post.title}</h3>
                            <p className="mt-2">{post.description}</p>
                            <a href={post.link} className="text-blue-600 hover:text-blue-400 mt-2 inline-block">Read more</a>
                        </motion.div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Blogs;