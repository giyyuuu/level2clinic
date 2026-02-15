import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { FAB } from '../components/FAB';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export const AppointmentsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { appointments, deleteAppointment, loadAppointments, getAppointmentsByDate } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'calendar'

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAppointments();
    });
    return unsubscribe;
  }, [navigation]);

  const markedDates = {};
  appointments.forEach((apt) => {
    if (markedDates[apt.date]) {
      markedDates[apt.date].marked = true;
      markedDates[apt.date].dots = [
        ...(markedDates[apt.date].dots || []),
        { color: colors.primary },
      ];
    } else {
      markedDates[apt.date] = {
        marked: true,
        dotColor: colors.primary,
      };
    }
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: colors.primary,
    };
  }

  const dayAppointments = getAppointmentsByDate(selectedDate);

  const handleDelete = (id, patientName, date, time) => {
    Alert.alert(
      'Delete Appointment',
      `Delete appointment with ${patientName} on ${date} at ${time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAppointment(id),
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'canceled':
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const renderAppointment = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={[styles.patientName, { color: colors.text }]}>{item.patientName}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {item.time}
            </Text>
          </View>
          {item.notes && (
            <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={2}>
              {item.notes}
            </Text>
          )}
        </View>
        <View style={styles.cardRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.patientName, item.date, item.time)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'day' && { borderBottomColor: colors.primary }]}
          onPress={() => setViewMode('day')}
        >
          <Text
            style={[
              styles.tabText,
              { color: viewMode === 'day' ? colors.primary : colors.textSecondary },
            ]}
          >
            Day View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'calendar' && { borderBottomColor: colors.primary }]}
          onPress={() => setViewMode('calendar')}
        >
          <Text
            style={[
              styles.tabText,
              { color: viewMode === 'calendar' ? colors.primary : colors.textSecondary },
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'calendar' ? (
        <>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#fff',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.placeholder,
              dotColor: colors.primary,
              selectedDotColor: '#fff',
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
            }}
            style={styles.calendar}
          />
          <View style={styles.dayHeader}>
            <Text style={[styles.dayHeaderText, { color: colors.text }]}>
              {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.dayHeader}>
          <Text style={[styles.dayHeaderText, { color: colors.text }]}>
            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>
      )}

      {dayAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={colors.placeholder} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No appointments for this day
          </Text>
        </View>
      ) : (
        <FlatList
          data={dayAppointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB onPress={() => navigation.navigate('AddAppointment', { selectedDate })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  calendar: {
    borderRadius: 0,
    marginBottom: 8,
  },
  dayHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  dayHeaderText: {
    fontSize: 18,
    fontWeight: '600',
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
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
    textAlign: 'center',
  },
});

