import React from 'react';
import { auth } from '@clerk/nextjs/server'

const Greetings = () => {
    const currentHour = new Date().getHours();
    const { sessionClaims } = auth();
    const firstName = sessionClaims?.firstName || `stranger`;

    const getGreeting = () => {
        if (currentHour < 12) {
            return "Good morning";
        } else if (currentHour < 18) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    };

    return (
        <>
            {getGreeting()}, {firstName as string} 👋
        </>
    );
};

export default Greetings;