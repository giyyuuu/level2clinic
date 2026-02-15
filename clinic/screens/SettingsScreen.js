import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export const SettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const {
    isDarkMode,
    toggleTheme,
    setPin,
    verifyPin,
    checkAuth,
    exportPatients,
    getDailyRevenue,
    treatments,
  } = useApp();
  const [hasBiometric, setHasBiometric] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPinValue] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  React.useEffect(() => {
    checkBiometric();
    checkPinStatus();
  }, []);

  const checkBiometric = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setHasBiometric(compatible && enrolled);
    } catch (error) {
      console.error('Error checking biometric:', error);
    }
  };

  const checkPinStatus = async () => {
    try {
      const pin = await SecureStore.getItemAsync('app_pin');
      setPinEnabled(!!pin);
    } catch (error) {
      console.error('Error checking PIN status:', error);
    }
  };

  const handleBiometricToggle = async (value) => {
    if (value) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Enable biometric authentication',
          cancelLabel: 'Cancel',
        });
        if (result.success) {
          setBiometricEnabled(true);
          Alert.alert('Success', 'Biometric authentication enabled');
        }
      } catch (error) {
        console.error('Biometric error:', error);
        Alert.alert('Error', 'Failed to enable biometric authentication');
      }
    } else {
      setBiometricEnabled(false);
    }
  };

  const handlePinSetup = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }
    try {
      await setPin(pin);
      setPinEnabled(true);
      setShowPinInput(false);
      setPinValue('');
      setConfirmPin('');
      Alert.alert('Success', 'PIN set successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to set PIN');
    }
  };

  const handleExport = async () => {
    try {
      const data = exportPatients();
      await Share.share({
        message: data,
        title: 'Patients Export',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRevenue = getDailyRevenue(today);
  const totalRevenue = treatments.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Summary</Text>
          <View style={styles.revenueRow}>
            <View style={styles.revenueItem}>
              <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>Today</Text>
              <Text style={[styles.revenueValue, { color: colors.primary }]}>
                ${todayRevenue.toFixed(2)}
              </Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>Total</Text>
              <Text style={[styles.revenueValue, { color: colors.primary }]}>
                ${totalRevenue.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>

          {hasBiometric && (
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="finger-print-outline" size={24} color={colors.text} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Biometric Lock
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          )}

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>PIN Lock</Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={(value) => {
                if (value) {
                  setShowPinInput(true);
                } else {
                  Alert.alert(
                    'Disable PIN',
                    'Are you sure?',
                    [
                      { text: 'Cancel', onPress: () => {} },
                      {
                        text: 'Disable',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await SecureStore.deleteItemAsync('app_pin');
                            setPinEnabled(false);
                          } catch (error) {
                            Alert.alert('Error', 'Failed to disable PIN');
                          }
                        },
                      },
                    ]
                  );
                }
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          {showPinInput && (
            <View style={styles.pinContainer}>
              <Input
                label="Enter PIN (min 4 digits)"
                value={pin}
                onChangeText={setPinValue}
                placeholder="PIN"
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />
              <Input
                label="Confirm PIN"
                value={confirmPin}
                onChangeText={setConfirmPin}
                placeholder="Confirm PIN"
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />
              <View style={styles.pinActions}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowPinInput(false);
                    setPinValue('');
                    setConfirmPin('');
                  }}
                  variant="secondary"
                  style={styles.pinButton}
                />
                <Button
                  title="Set PIN"
                  onPress={handlePinSetup}
                  style={styles.pinButton}
                />
              </View>
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleExport}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={24} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Export Patients Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  revenueItem: {
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  pinContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  pinActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  pinButton: {
    flex: 1,
  },
});

