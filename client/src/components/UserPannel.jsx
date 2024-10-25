import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceList from '../pages/ServiceList';
import UserNavbar from './UserNavbar';


const UserPanel = () => {

    return (
        <>
        <UserNavbar />
        <div className='bg-gray-900 min-h-screen flex flex-col items-center-my justify-center p-6'>
            <ServiceList showButton={true} />     
        </div>
        
        </>
    );
};

export default UserPanel;
