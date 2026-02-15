import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export const LockScreen = ({ onUnlock }) => {
  const { colors } = useTheme();
  const { verifyPin, setIsAuthenticated } = useApp();
  const [pin, setPin] = useState('');
  const [hasBiometric, setHasBiometric] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometric();
    attemptBiometric();
  }, []);

  const checkBiometric = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const enabled = await SecureStore.getItemAsync('biometric_enabled');
      setHasBiometric(compatible && enrolled);
      setBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error checking biometric:', error);
    }
  };

  const attemptBiometric = async () => {
    if (hasBiometric && biometricEnabled) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to unlock',
          cancelLabel: 'Cancel',
          disableDeviceFallback: false,
        });
        if (result.success) {
          setIsAuthenticated(true);
          if (onUnlock) onUnlock();
        }
      } catch (error) {
        console.error('Biometric error:', error);
      }
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    const isValid = await verifyPin(pin);
    if (isValid) {
      setIsAuthenticated(true);
      if (onUnlock) onUnlock();
    } else {
      Alert.alert('Error', 'Incorrect PIN');
      setPin('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={64} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Unlock App</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your PIN to continue
        </Text>

        <View style={styles.pinContainer}>
          <TextInput
            style={[styles.pinInput, { color: colors.text, borderColor: colors.border }]}
            value={pin}
            onChangeText={setPin}
            placeholder="Enter PIN"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            autoFocus
            onSubmitEditing={handlePinSubmit}
          />
        </View>

        <TouchableOpacity
          style={[styles.unlockButton, { backgroundColor: colors.primary }]}
          onPress={handlePinSubmit}
        >
          <Text style={styles.unlockButtonText}>Unlock</Text>
        </TouchableOpacity>

        {hasBiometric && biometricEnabled && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={attemptBiometric}
          >
            <Ionicons name="finger-print" size={32} color={colors.primary} />
            <Text style={[styles.biometricText, { color: colors.primary }]}>
              Use Biometric
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  pinContainer: {
    width: '100%',
    marginBottom: 24,
  },
  pinInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
  },
  unlockButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  biometricText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});

