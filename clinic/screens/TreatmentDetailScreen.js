import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';

export const TreatmentDetailScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { treatments, deleteTreatment } = useApp();
  const { treatmentId } = route.params;

  const treatment = treatments.find((t) => t.id === treatmentId);

  if (!treatment) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Treatment not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Treatment',
      `Are you sure you want to delete this treatment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTreatment(treatmentId);
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
          <Text style={[styles.label, { color: colors.textSecondary }]}>Patient</Text>
          <Text style={[styles.value, { color: colors.text }]}>{treatment.patientName}</Text>

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
            Description
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>{treatment.description}</Text>

          {treatment.prescriptions && (
            <>
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
                Prescriptions
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {treatment.prescriptions}
              </Text>
            </>
          )}

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Cost</Text>
              <Text style={[styles.cost, { color: colors.primary }]}>
                ${parseFloat(treatment.cost || 0).toFixed(2)}
              </Text>
            </View>
            {treatment.appointmentDate && (
              <View style={styles.rowItem}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {format(new Date(treatment.appointmentDate), 'MMM d, yyyy')}
                </Text>
              </View>
            )}
          </View>

          {treatment.followUpDate && (
            <>
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
                Follow-up Date
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {format(new Date(treatment.followUpDate), 'MMMM d, yyyy')}
              </Text>
            </>
          )}
        </Card>

        <View style={styles.actions}>
          <Button
            title="Edit Treatment"
            onPress={() => navigation.navigate('AddTreatment', { treatment })}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Delete Treatment"
            onPress={handleDelete}
            variant="danger"
            style={styles.actionButton}
          />
        </View>
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  cost: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rowItem: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

