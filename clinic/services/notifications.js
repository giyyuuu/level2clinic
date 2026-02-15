import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

export const scheduleAppointmentReminder = async (appointment) => {
  try {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const reminderDate = new Date(appointmentDate);
    reminderDate.setHours(reminderDate.getHours() - 1); // 1 hour before

    if (reminderDate <= new Date()) {
      console.warn('Reminder time is in the past');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Appointment Reminder',
        body: `You have an appointment with ${appointment.patientName} at ${appointment.time}`,
        data: { appointmentId: appointment.id },
      },
      trigger: {
        date: reminderDate,
      },
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

export const cancelAppointmentReminder = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

