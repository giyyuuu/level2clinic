import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const AddPatientScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { addPatient, updatePatient } = useApp();
  const patient = route?.params?.patient;

  const [formData, setFormData] = useState({
    fullName: patient?.fullName || '',
    age: patient?.age?.toString() || '',
    phoneNumber: patient?.phoneNumber || '',
    nenType: patient?.nenType || '',
    medicalNotes: patient?.medicalNotes || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) < 0 || parseInt(formData.age) > 150) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
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
      const patientData = {
        fullName: formData.fullName.trim(),
        age: parseInt(formData.age),
        phoneNumber: formData.phoneNumber.trim(),
        nenType: formData.nenType.trim() || null,
        medicalNotes: formData.medicalNotes.trim(),
      };

      if (patient) {
        await updatePatient(patient.id, patientData);
        Alert.alert('Success', 'Patient updated successfully');
      } else {
        await addPatient(patientData);
        Alert.alert('Success', 'Patient added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save patient. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Full Name *"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          placeholder="Enter full name"
          error={errors.fullName}
          autoCapitalize="words"
        />

        <Input
          label="Age *"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          placeholder="Enter age"
          keyboardType="numeric"
          error={errors.age}
        />

        <Input
          label="Phone Number *"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          error={errors.phoneNumber}
        />

        <Input
          label="Nen Type (Optional)"
          value={formData.nenType}
          onChangeText={(text) => setFormData({ ...formData, nenType: text })}
          placeholder="Enhancement, Transmutation, etc."
          autoCapitalize="words"
        />

        <Input
          label="Medical Notes"
          value={formData.medicalNotes}
          onChangeText={(text) => setFormData({ ...formData, medicalNotes: text })}
          placeholder="Enter medical notes"
          multiline
          numberOfLines={4}
        />

        <Button
          title={patient ? 'Update Patient' : 'Add Patient'}
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
  submitButton: {
    marginTop: 8,
  },
});

