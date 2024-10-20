import React, { useEffect, useState } from 'react';
import {
    fetchUsers,
    fetchTechnicians,
    fetchRequests,
    fetchPaymentServices
} from '../api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [requests, setRequests] = useState([]);
    const [paymentServices, setPaymentServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, techniciansData, requestsData, paymentData] = await Promise.all([
                    fetchUsers(),
                    fetchTechnicians(),
                    fetchRequests(),
                    fetchPaymentServices(),
                ]);

                setUsers(usersData);
                setTechnicians(techniciansData);
                setRequests(requestsData);
                setPaymentServices(paymentData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <p className="text-lg">Total: {users.length}</p>
                    <ul className="mt-2">
                        {users.slice(0, 5).map(user => (
                            <li key={user.id} className="text-gray-300">{user.username} - {user.email}</li>
                        ))}
                    </ul>
                    <a href="/admin/users" className="text-blue-400 hover:underline mt-2 block">View All</a>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold">Technicians</h2>
                    <p className="text-lg">Total: {technicians.length}</p>
                    <ul className="mt-2">
                        {technicians.slice(0, 5).map(tech => (
                            <li key={tech.id} className="text-gray-300">{tech.username} - {tech.occupation}</li>
                        ))}
                    </ul>
                    <a href="/admin/technicians" className="text-blue-400 hover:underline mt-2 block">View All</a>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold">Requests</h2>
                    <p className="text-lg">Total: {requests.length}</p>
                    <ul className="mt-2">
                        {requests.slice(0, 5).map(request => (
                            <li key={request.id} className="text-gray-300">{request.title} - {request.status}</li>
                        ))}
                    </ul>
                    <a href="/admin/requests" className="text-blue-400 hover:underline mt-2 block">View All</a>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold">Payment Services</h2>
                    <p className="text-lg">Total: {paymentServices.length}</p>
                    <ul className="mt-2">
                        {paymentServices.slice(0, 5).map(service => (
                            <li key={service.id} className="text-gray-300">{service.name} - {service.status}</li>
                        ))}
                    </ul>
                    <a href="/admin/payments" className="text-blue-400 hover:underline mt-2 block">View All</a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;