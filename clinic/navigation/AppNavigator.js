import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import { PatientsScreen } from '../screens/PatientsScreen';
import { AddPatientScreen } from '../screens/AddPatientScreen';
import { PatientDetailScreen } from '../screens/PatientDetailScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { AddAppointmentScreen } from '../screens/AddAppointmentScreen';
import { TreatmentsScreen } from '../screens/TreatmentsScreen';
import { AddTreatmentScreen } from '../screens/AddTreatmentScreen';
import { TreatmentDetailScreen } from '../screens/TreatmentDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

// Fix for SettingsScreen import in Tab Navigator
const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsList"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PatientsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PatientsList"
      component={PatientsScreen}
      options={{ title: 'Patients', headerShown: false }}
    />
    <Stack.Screen
      name="AddPatient"
      component={AddPatientScreen}
      options={{ title: 'Add Patient' }}
    />
    <Stack.Screen
      name="PatientDetail"
      component={PatientDetailScreen}
      options={{ title: 'Patient Details' }}
    />
  </Stack.Navigator>
);

const AppointmentsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AppointmentsList"
      component={AppointmentsScreen}
      options={{ title: 'Appointments', headerShown: false }}
    />
    <Stack.Screen
      name="AddAppointment"
      component={AddAppointmentScreen}
      options={{ title: 'New Appointment' }}
    />
    <Stack.Screen
      name="AppointmentDetail"
      component={AddAppointmentScreen}
      options={{ title: 'Appointment Details' }}
    />
  </Stack.Navigator>
);

const TreatmentsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TreatmentsList"
      component={TreatmentsScreen}
      options={{ title: 'Treatments', headerShown: false }}
    />
    <Stack.Screen
      name="AddTreatment"
      component={AddTreatmentScreen}
      options={{ title: 'New Treatment' }}
    />
    <Stack.Screen
      name="TreatmentDetail"
      component={TreatmentDetailScreen}
      options={{ title: 'Treatment Details' }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Treatments') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Patients"
        component={PatientsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Treatments"
        component={TreatmentsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

