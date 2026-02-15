import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { FAB } from '../components/FAB';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export const TreatmentsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { treatments, deleteTreatment, loadTreatments } = useApp();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTreatments();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id, description) => {
    Alert.alert(
      'Delete Treatment',
      `Delete treatment: ${description}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTreatment(id),
        },
      ]
    );
  };

  const renderTreatment = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('TreatmentDetail', { treatmentId: item.id })}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={[styles.patientName, { color: colors.text }]}>
            {item.patientName}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.appointmentDate ? format(new Date(item.appointmentDate), 'MMM d') : 'N/A'}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.primary, fontWeight: '600' }]}>
                ${parseFloat(item.cost || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.description)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {treatments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical-outline" size={64} color={colors.placeholder} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No treatments recorded
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Add treatments from appointments
          </Text>
        </View>
      ) : (
        <FlatList
          data={treatments}
          renderItem={renderTreatment}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB onPress={() => navigation.navigate('AddTreatment')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

