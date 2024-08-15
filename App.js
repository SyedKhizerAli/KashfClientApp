import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native'
import Navigation from './src/Navigation.js';
import { AuthProvider } from './src/context/AuthContext.js';
import AppNav from './src/AppNav.js';

function App({ }) {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}

export default App;