import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppNavigator } from './navigation/AppNavigator';
import { LockScreen } from './screens/LockScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useApp } from './context/AppContext';
import { registerForPushNotifications } from './services/notifications';

const AppContent = () => {
  const { isAuthenticated, isDbInitialized, checkAuth } = useApp();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await registerForPushNotifications();
      } catch (error) {
        console.error('Notification registration error:', error);
      }
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check error:', error);
      }
      setAuthChecked(true);
      setIsCheckingAuth(false);
    };
    initialize();
  }, []);

  if (isCheckingAuth || !isDbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (authChecked && !isAuthenticated) {
    return (
      <>
        <StatusBar style="auto" />
        <LockScreen onUnlock={() => {}} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

