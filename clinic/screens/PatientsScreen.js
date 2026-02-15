import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FAB } from '../components/FAB';
import { Ionicons } from '@expo/vector-icons';

export const PatientsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { patients, deletePatient, searchPatients, loadPatients } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPatients();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchPatients(searchQuery);
    } else {
      loadPatients();
    }
  }, [searchQuery]);

  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePatient(id),
        },
      ]
    );
  };

  const renderPatient = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={[styles.name, { color: colors.text }]}>{item.fullName}</Text>
          <Text style={[styles.info, { color: colors.textSecondary }]}>
            Age: {item.age} • {item.phoneNumber}
          </Text>
          {item.nenType && (
            <Text style={[styles.nenType, { color: colors.primary }]}>
              Nen Type: {item.nenType}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.fullName)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search patients..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.placeholder} />
          </TouchableOpacity>
        )}
      </View>

      {patients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={colors.placeholder} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No patients found
          </Text>
          <Button
            title="Add First Patient"
            onPress={() => navigation.navigate('AddPatient')}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={patients}
          renderItem={renderPatient}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB onPress={() => navigation.navigate('AddPatient')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
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
    alignItems: 'flex-start',
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  nenType: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
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
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
});

