import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [loggedInCnic, setLoggedInCnic] = useState(null);

    const login = async (token, cnic) => {
        try {
            // Store the token securely
            const tokenString = JSON.stringify(token);
            const cnicString = JSON.stringify(cnic)
            console.log(tokenString)
            console.log(cnicString)
            await SecureStore.setItemAsync('userToken', tokenString);
            await SecureStore.setItemAsync('loggedInCnic', cnicString);
            setUserToken(token);
            setLoggedInCnic(cnic)
            setIsLoading(false);
        } catch (error) {
            console.error('Error storing token:', error);
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Remove the stored token
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('loggedInCnic');
            setUserToken(null);
            setLoggedInCnic(null)
            setIsLoading(false);
        } catch (error) {
            console.error('Error removing stored token:', error);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, loggedInCnic }}>
            {children}
        </AuthContext.Provider>
    );
}