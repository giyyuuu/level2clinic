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

export const AddTreatmentScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { patients, appointments, addTreatment, updateTreatment } = useApp();
  const treatment = route?.params?.treatment;
  const appointmentId = route?.params?.appointmentId;

  const [formData, setFormData] = useState({
    appointmentId: treatment?.appointmentId?.toString() || appointmentId?.toString() || '',
    patientId: treatment?.patientId?.toString() || '',
    description: treatment?.description || '',
    prescriptions: treatment?.prescriptions || '',
    cost: treatment?.cost?.toString() || '0',
    followUpDate: treatment?.followUpDate || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter appointments and patients based on selection
  const availableAppointments = appointmentId
    ? appointments.filter((apt) => apt.id === parseInt(appointmentId))
    : appointments;

  const selectedAppointment = availableAppointments.find(
    (apt) => apt.id === parseInt(formData.appointmentId)
  );

  useEffect(() => {
    if (selectedAppointment && !formData.patientId) {
      setFormData({ ...formData, patientId: selectedAppointment.patientId.toString() });
    }
  }, [formData.appointmentId]);

  const validate = () => {
    const newErrors = {};

    if (!formData.appointmentId) {
      newErrors.appointmentId = 'Please select an appointment';
    }

    if (!formData.patientId) {
      newErrors.patientId = 'Please select a patient';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.cost || isNaN(formData.cost) || parseFloat(formData.cost) < 0) {
      newErrors.cost = 'Please enter a valid cost';
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
      const treatmentData = {
        appointmentId: parseInt(formData.appointmentId),
        patientId: parseInt(formData.patientId),
        description: formData.description.trim(),
        prescriptions: formData.prescriptions.trim(),
        cost: parseFloat(formData.cost),
        followUpDate: formData.followUpDate || null,
      };

      if (treatment) {
        await updateTreatment(treatment.id, treatmentData);
        Alert.alert('Success', 'Treatment updated successfully');
      } else {
        await addTreatment(treatmentData);
        Alert.alert('Success', 'Treatment added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save treatment. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, followUpDate: format(selectedDate, 'yyyy-MM-dd') });
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
          <Text style={[styles.label, { color: colors.text }]}>Appointment *</Text>
          <View style={[styles.pickerWrapper, { backgroundColor: colors.surface, borderColor: errors.appointmentId ? colors.error : colors.border }]}>
            <Picker
              selectedValue={formData.appointmentId}
              onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}
              style={[styles.picker, { color: colors.text }]}
              enabled={!appointmentId}
            >
              <Picker.Item label="Select an appointment" value="" />
              {availableAppointments.map((apt) => (
                <Picker.Item
                  key={apt.id}
                  label={`${apt.patientName} - ${apt.date} ${apt.time}`}
                  value={apt.id.toString()}
                />
              ))}
            </Picker>
          </View>
          {errors.appointmentId && (
            <Text style={[styles.error, { color: colors.error }]}>{errors.appointmentId}</Text>
          )}
        </View>

        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Patient *</Text>
          <View style={[styles.pickerWrapper, { backgroundColor: colors.surface, borderColor: errors.patientId ? colors.error : colors.border }]}>
            <Picker
              selectedValue={formData.patientId}
              onValueChange={(value) => setFormData({ ...formData, patientId: value })}
              style={[styles.picker, { color: colors.text }]}
              enabled={!selectedAppointment}
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

        <Input
          label="Description *"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Enter treatment description"
          multiline
          numberOfLines={3}
          error={errors.description}
        />

        <Input
          label="Prescriptions"
          value={formData.prescriptions}
          onChangeText={(text) => setFormData({ ...formData, prescriptions: text })}
          placeholder="Enter prescriptions"
          multiline
          numberOfLines={3}
        />

        <Input
          label="Cost *"
          value={formData.cost}
          onChangeText={(text) => setFormData({ ...formData, cost: text })}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.cost}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateTimeButton}
        >
          <Card style={styles.dateTimeCard}>
            <Text style={[styles.label, { color: colors.text }]}>Follow-up Date (Optional)</Text>
            <Text style={[styles.dateTimeValue, { color: colors.text }]}>
              {formData.followUpDate
                ? format(new Date(formData.followUpDate), 'MMMM d, yyyy')
                : 'Select follow-up date'}
            </Text>
          </Card>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.followUpDate ? new Date(formData.followUpDate) : new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <Button
          title={treatment ? 'Update Treatment' : 'Add Treatment'}
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

