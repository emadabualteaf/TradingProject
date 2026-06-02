import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start, check if a previous session was saved on the device
  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const savedToken = await AsyncStorage.getItem('authToken');
      const savedUser = await AsyncStorage.getItem('userData');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('Could not restore session:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Called after a successful login API response
  async function login(userData, authToken) {
    try {
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.log('Could not save session:', error);
    }
  }

  // Called when the user taps "Log Out"
  async function logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.log('Could not clear session:', error);
    }
  }

  // Called from the Profile screen after editing profile details
  async function updateUser(updatedFields) {
    try {
      const updated = { ...user, ...updatedFields };
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
      setUser(updated);
    } catch (error) {
      console.log('Could not update user data:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — any screen imports this instead of the raw context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
