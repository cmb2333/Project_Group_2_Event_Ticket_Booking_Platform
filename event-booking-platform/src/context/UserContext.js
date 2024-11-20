import React, { createContext, useContext, useState, useEffect } from 'react';

// Create UserContext
const UserContext = createContext();
export const useUser = () => useContext(UserContext);

// Create UserProvider to wrap app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user data from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            console.log('Loading user from localStorage:', storedUser);
            setUser(JSON.parse(storedUser)); 
        }
    }, []);

    // Login user and update / persist session in local
    const login = (userData) => {
        console.log('Setting user in context and localStorage:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); 
    };

    const logout = () => {
        console.log('Clearing user from context and localStorage');
        // Clear session data
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
