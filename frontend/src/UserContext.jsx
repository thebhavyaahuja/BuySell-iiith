import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // You could implement a /profile endpoint on backend to return user data from token
    async function fetchUser() {
        try {
            const res = await axios.get('/profile', {withCredentials:true}); // create a route to verify token and return user details
            setUser(res.data);
            // console.log(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}