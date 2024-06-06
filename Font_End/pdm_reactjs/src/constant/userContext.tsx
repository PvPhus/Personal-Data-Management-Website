import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextProps {
    userId: number  | null;
    setUserId: (id: number  | null) => void; // Allow null as well
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);
    useEffect(() => {
        // Load user data from localStorage or API
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(Number(storedUserId));
        }
    }, []);

    useEffect(() => {
        if (userId !== null) {
            localStorage.setItem('userId', userId.toString());
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};