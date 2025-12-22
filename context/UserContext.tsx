import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the user object
interface User {
    uid: string;
    email: string;
    username: string; // Full Name
    role: string;
    sportType?: string;
    teamName?: string;
    profileImage?: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
