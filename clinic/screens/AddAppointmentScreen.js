import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';

export const AddAppointmentScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { patients, addAppointment, updateAppointment } = useApp();
  const appointment = route?.params?.appointment;
  const initialDate = route?.params?.selectedDate || format(new Date(), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    patientId: appointment?.patientId?.toString() || '',
    date: appointment?.date || initialDate,
    time: appointment?.time || '10:00',
    status: appointment?.status || 'scheduled',
    notes: appointment?.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Please select a patient';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patientId: parseInt(formData.patientId),
        date: formData.date,
        time: formData.time,
        status: formData.status,
        notes: formData.notes.trim(),
      };

      if (appointment) {
        await updateAppointment(appointment.id, appointmentData);
        Alert.alert('Success', 'Appointment updated successfully');
      } else {
        await addAppointment(appointmentData);
        Alert.alert('Success', 'Appointment created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save appointment. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: format(selectedDate, 'yyyy-MM-dd') });
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData({ ...formData, time: format(selectedTime, 'HH:mm') });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Patient *</Text>
          <View style={[styles.pickerWrapper, { backgroundColor: colors.surface, borderColor: errors.patientId ? colors.error : colors.border }]}>
            <Picker
              selectedValue={formData.patientId}
              onValueChange={(value) => setFormData({ ...formData, patientId: value })}
              style={[styles.picker, { color: colors.text }]}
            >
              <Picker.Item label="Select a patient" value="" />
              {patients.map((patient) => (
                <Picker.Item
                  key={patient.id}
                  label={patient.fullName}
                  value={patient.id.toString()}
                />
              ))}
            </Picker>
          </View>
          {errors.patientId && (
            <Text style={[styles.error, { color: colors.error }]}>{errors.patientId}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateTimeButton}
        >
          <Card style={styles.dateTimeCard}>
            <Text style={[styles.label, { color: colors.text }]}>Date *</Text>
            <Text style={[styles.dateTimeValue, { color: colors.text }]>
              {formData.date ? format(new Date(formData.date), 'MMMM d, yyyy') : 'Select date'}
            </Text>
          </Card>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.date)}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.dateTimeButton}
        >
          <Card style={styles.dateTimeCard}>
            <Text style={[styles.label, { color: colors.text }]}>Time *</Text>
            <Text style={[styles.dateTimeValue, { color: colors.text }]}>
              {formData.time}
            </Text>
          </Card>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={new Date(`2000-01-01T${formData.time}`)}
            mode="time"
            display="default"
            onChange={onTimeChange}
            is24Hour={false}
          />
        )}

        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Status</Text>
          <View style={[styles.pickerWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              style={[styles.picker, { color: colors.text }]}
            >
              <Picker.Item label="Scheduled" value="scheduled" />
              <Picker.Item label="Completed" value="completed" />
              <Picker.Item label="Canceled" value="canceled" />
            </Picker>
          </View>
        </View>

        <Input
          label="Notes"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          placeholder="Enter appointment notes"
          multiline
          numberOfLines={4}
        />

        <Button
          title={appointment ? 'Update Appointment' : 'Create Appointment'}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
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
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  dateTimeButton: {
    marginBottom: 16,
  },
  dateTimeCard: {
    padding: 16,
  },
  dateTimeValue: {
    fontSize: 16,
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
  },
});

