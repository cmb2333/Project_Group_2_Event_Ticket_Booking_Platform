import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// If not logged in, re-route the user to signin
const ProtectedRoute = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/signin" />;
    }

    return children;
};

export default ProtectedRoute;
