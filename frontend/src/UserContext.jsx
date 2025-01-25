import { createContext, useState } from 'react';

export const UserContext = createContext();

// This context holds “user” and “setUser” globally
export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}