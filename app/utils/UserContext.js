/*Central State Management (Context/Redux)
To avoid fetching the user data multiple times and keep screens
DRY (Don't Repeat Yourself).
React's Context API/State Management Library fetch user data and provide
it down to other screens.
*/ 

import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext({ user: null }); //Context creation

//export const useUser = () => useContext(UserContext); //Export hook for easy access

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };
        fetchUserData();
    }, []);

    const updateUser = async (newUserData) => {
        setUser(newUserData);
        await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
    };

return (
    <UserContext.Provider value={{ user, updateUser }}>
        {children}
    </UserContext.Provider>
);
};

export const useUser = () => useContext(UserContext);

export default UserContext;