import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextProps {
    userId: number | null;
    setUserId: (id: number | null) => void;
    role: string | null;
    setRole: (role: string | null) => void; 
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedrole = localStorage.getItem('role');
        if (storedUserId) {
            setUserId(Number(storedUserId));
        }
        if (storedrole) {
            setRole(storedrole);
        }
    }, []);

    useEffect(() => {
        if (userId !== null) {
            localStorage.setItem('userId', userId.toString());
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    useEffect(() => {
        if (role !== null) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [role]);

    return (
        <UserContext.Provider value={{ userId, setUserId, role, setRole }}>
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
