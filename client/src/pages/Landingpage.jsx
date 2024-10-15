// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
// import Blogs from '../components/Blogs';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';
// import Services from '../pages/Services';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Landingpage = () => {
    const [userInfo, setUserInfo] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div id='home' className='bg-black bg-opacity-90 min-h-screen m-0 p-0 overflow-x-hidden overflow-y-hidden'>
            <Navbar />
            {/* Hero Section */}
            <section className="hero text-center p-8 md:p-10 lg:p-12 text-white">
                <motion.h1
                    className="text-3xl md:text-4xl font-bold"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Your Trusted Home Repair Service
                </motion.h1>
                <motion.p
                    className="mt-4 text-base md:text-lg"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Reliable repairs for every corner of your home.
                </motion.p>
                <a href="#services" className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded mt-4 inline-block transition-transform transform hover:scale-105">Book a Service</a>
            </section>

            {/* Services Section */}
            <section id="services" className="py-8 md:py-10 lg:py-12 px-4 bg-black bg-opacity-80">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-white">Our Services</h2>
                {/* <Services /> */}
            </section>

            {/* About Us Section */}
            <section id="about" className="py-8 md:py-10 lg:py-12 bg-gray-800">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-white">About Us</h2>
                <p className="mt-4 text-center text-white">We are committed to providing high-quality home repair services to ensure your comfort and satisfaction.</p>
            </section>

            {/* Blog Section */}
            <section id="blogs" className="py-8 md:py-10 lg:py-12 bg-gray-800"> 
                {/* <Blogs /> */}
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-8 md:py-10 lg:py-12 bg-black bg-opacity-80 text-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center">What Our Customers Say</h2>
                <blockquote className="text-center mt-4">
                    <p>Amazing service! Highly recommend!</p>
                    <footer className="mt-2">- Eustache Katembo</footer>
                </blockquote>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-8 md:py-10 lg:py-12 bg-gray-800">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-white">Contact Us</h2>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="border p-2 w-full mb-4"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        className="border p-2 w-full mb-4"
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={userInfo.message}
                        onChange={handleInputChange}
                        className="border p-2 w-full mb-4"
                        required
                    ></textarea>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
                </form>
                {submitted && <ContactInfo userInfo={userInfo} />}
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Landingpage;
