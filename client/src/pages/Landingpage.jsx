// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from 'react';
import Blogs from '../components/Blogs';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';
import Services from '../pages/Services';
import { useAuth } from '../configs/AuthContext'; // Use useAuth hook
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../index.css';

// Testimonial data
const testimonials = [
    { quote: "Amazing service! Highly recommend!", author: "John Doe" },
    { quote: "Professional and efficient! My repairs were completed on time.", author: "Jane Smith" },
    { quote: "The team was friendly and knowledgeable. I felt taken care of.", author: "Bob Johnson" },
    { quote: "Excellent quality of work! I will definitely use their services again.", author: "Alice Martinez" },
    { quote: "Fast response time and great results! Very satisfied!", author: "David Lee" },
];

// eslint-disable-next-line react/prop-types
const Section = ({ id, bgImage, title, children, textColor = 'text-white' }) => (
    <section id={id} className={`section py-10 md:py-12 lg:py-16 relative overflow-hidden ${textColor}`}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="relative z-10 section-content bg-black bg-opacity-60 p-8 rounded-lg shadow-lg">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center ${textColor}`}>{title}</h2>
            {children}
        </div>
    </section>
);

const Landingpage = () => {
    const [userInfo, setUserInfo] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const { user } = useAuth(); // Access user state from AuthContext

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const handleBookServiceClick = () => {
        if (!user) {
            // If user is not logged in, redirect to sign up page
            window.location.href = '/signup'; // Change this to your sign up route
        } else {
            // If user is logged in, redirect to login page
            window.location.href = '/login'; // Change this to your login route
        }
    };

    return (
        <div id='home' className='bg-black bg-opacity-90 min-h-screen flex flex-col'>
            <Navbar />

            {/* Hero Section */}
            <section className="hero section py-10 md:py-12 lg:py-16 text-center text-white">
                <motion.div className="section-content relative z-10">
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold mb-4"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Your Trusted Home Repair Service
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl mb-6"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Reliable repairs for every corner of your home.
                    </motion.p>
                    <button 
                        onClick={handleBookServiceClick} 
                        className="bg-blue-600 text-white px-6 py-3 rounded mt-4 inline-block transition-transform transform hover:scale-105 shadow-md"
                    >
                        Book a Service
                    </button>
                </motion.div>
            </section>

            {/* Services Section */}
            <Section id="services" bgImage="./public/4322372.jpg" title="Our Services">
                <Services />
            </Section>

            {/* Blog Section */}
            <Section id="blogs" bgImage="/path/to/your/image4.jpg" title="Latest Blogs">
                <Blogs />
            </Section>

            {/* Prototype Section */}
            <Section id="prototype" bgImage="./public/4882066.jpg" title="Prototype Showcase">
                <div className="mt-4 text-center text-white px-4">
                    <p className="mb-4">Check out our latest prototype showcasing the innovative features of our home repair services.</p>
                    <img src="/public/prototype.jpg" alt="Prototype Showcase" className="mx-auto rounded-lg shadow-lg" />
                </div>
            </Section>

            {/* Testimonials Section */}
            <Section id="testimonials" bgImage="/public/testimonials-section-background.png" title="Testimonials">
                <div className="mt-4 space-y-4 px-4">
                    {testimonials.map((testimonial, index) => (
                        <blockquote key={index} className="text-center">
                            <p className="italic text-lg">&quot;{testimonial.quote}&quot;</p>
                            <footer className="mt-2 font-semibold">- {testimonial.author}</footer>
                        </blockquote>
                    ))}
                </div>
            </Section>

            {/* Contact Section */}
            <Section id="contact" bgImage="/path/to/your/image6.jpg" title="Contact Us">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-3 w-full mb-4 rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-3 w-full mb-4 rounded"
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={userInfo.message}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-3 w-full mb-4 rounded"
                        required
                    ></textarea>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md hover:bg-blue-700 transition">
                        Send Message
                    </button>
                </form>
                {submitted && <ContactInfo userInfo={userInfo} />}
            </Section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Landingpage;