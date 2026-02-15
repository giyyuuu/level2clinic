import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

export const PatientDetailScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { patients, deletePatient, appointments, treatments } = useApp();
  const { patientId } = route.params;

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Patient not found</Text>
      </View>
    );
  }

  const patientAppointments = appointments.filter((apt) => apt.patientId === patientId);
  const patientTreatments = treatments.filter((t) => t.patientId === patientId);

  const handleDelete = () => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to delete ${patient.fullName}? This will also delete all associated appointments and treatments.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePatient(patientId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.infoCard}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={[styles.name, { color: colors.text }]}>{patient.fullName}</Text>
              <Text style={[styles.info, { color: colors.textSecondary }]}>
                Age: {patient.age}
              </Text>
              <Text style={[styles.info, { color: colors.textSecondary }]}>
                Phone: {patient.phoneNumber}
              </Text>
              {patient.nenType && (
                <View style={styles.badge}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>
                    {patient.nenType}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {patient.medicalNotes && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Medical Notes</Text>
              <Text style={[styles.notes, { color: colors.textSecondary }]}>
                {patient.medicalNotes}
              </Text>
            </View>
          )}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {patientAppointments.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Appointments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {patientTreatments.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Treatments</Text>
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Edit Patient"
            onPress={() => navigation.navigate('AddPatient', { patient })}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Delete Patient"
            onPress={handleDelete}
            variant="danger"
            style={styles.actionButton}
          />
        </View>

        {patientAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Appointments</Text>
            {patientAppointments.slice(0, 3).map((apt) => (
              <Card key={apt.id} style={styles.itemCard}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>
                  {apt.date} at {apt.time}
                </Text>
                <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                  Status: {apt.status}
                </Text>
              </Card>
            ))}
          </View>
        )}
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
    paddingBottom: 100,
  },
  infoCard: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  itemCard: {
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

