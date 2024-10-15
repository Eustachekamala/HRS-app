// eslint-disable-next-line no-unused-vars
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8 px-4">
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Info */}
                <div>
                    <h3 className="text-lg font-bold mb-4">About Us</h3>
                    <p className="text-gray-300 mb-2">
                        We are dedicated to providing high-quality home repair services with a focus on customer satisfaction.
                    </p>
                    <p className="text-gray-300 mb-2">Your home is your sanctuary, and we ensure it stays that way.</p>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Our Services</h3>
                    <ul className="space-y-2">
                        <li><a href="#services" className="hover:text-blue-400">Plumbing</a></li>
                        <li><a href="#services" className="hover:text-blue-400">Electrical</a></li>
                        <li><a href="#services" className="hover:text-blue-400">Carpentry</a></li>
                        <li><a href="#services" className="hover:text-blue-400">Painting</a></li>
                        <li><a href="#services" className="hover:text-blue-400">Home Renovations</a></li>
                    </ul>
                </div>

                {/* Testimonials */}
                <div>
                    <h3 className="text-lg font-bold mb-4">What Our Clients Say</h3>
                    <blockquote className="text-gray-300 italic mb-2">
                        The best service I’ve ever experienced! Highly recommend.
                    </blockquote>
                    <blockquote className="text-gray-300 italic">
                        Professional and efficient. My home has never looked better!
                    </blockquote>
                </div>

                {/* Contact Info */}
                <div className="md:col-span-2">
                    <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                    <p className="text-gray-300">Phone: (+254) 719405934</p>
                    <p className="text-gray-300">Email: info@homerepairservice.com</p>
                    <p className="text-gray-300">Location: Nairobi, Kenya</p>
                </div>

                {/* Social Media Links */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-300 hover:text-blue-400">
                            <FaFacebookF className="inline mr-1" /> Facebook
                        </a>
                        <a href="#" className="text-gray-300 hover:text-blue-400">
                            <FaTwitter className="inline mr-1" /> Twitter
                        </a>
                        <a href="#" className="text-gray-300 hover:text-blue-400">
                            <FaInstagram className="inline mr-1" /> Instagram
                        </a>
                        <a href="#" className="text-gray-300 hover:text-blue-400">
                            <FaLinkedinIn className="inline mr-1" /> LinkedIn
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Home Repair Service. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
