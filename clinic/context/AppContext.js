import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDB, initDatabase, seedDatabase } from '../database/db';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleAppointmentReminder } from '../services/notifications';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);

  // Initialize database
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        await seedDatabase();
        setIsDbInitialized(true);
        loadPatients();
        loadAppointments();
        loadTreatments();
        loadTheme();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initialize();
  }, []);

  // Load theme preference
  const loadTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem('theme');
      if (theme === 'dark') {
        setIsDarkMode(true);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  // Toggle theme
  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Load patients
  const loadPatients = () => {
    const database = getDB();
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM patients ORDER BY createdAt DESC',
        [],
        (_, { rows }) => {
          setPatients(rows._array);
        }),
        (_, error) => {
          console.error('Error loading patients:', error);
        }
      );
    });
  };

  // Add patient
  const addPatient = (patientData) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      const now = new Date().toISOString();
      database.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO patients (fullName, age, phoneNumber, nenType, medicalNotes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            patientData.fullName,
            patientData.age,
            patientData.phoneNumber,
            patientData.nenType || null,
            patientData.medicalNotes || '',
            now,
            now,
          ],
          (_, result) => {
            loadPatients();
            resolve(result.insertId);
          },
          (_, error) => {
            console.error('Error adding patient:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Update patient
  const updatePatient = (id, patientData) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      const now = new Date().toISOString();
      database.transaction((tx) => {
        tx.executeSql(
          'UPDATE patients SET fullName = ?, age = ?, phoneNumber = ?, nenType = ?, medicalNotes = ?, updatedAt = ? WHERE id = ?',
          [
            patientData.fullName,
            patientData.age,
            patientData.phoneNumber,
            patientData.nenType || null,
            patientData.medicalNotes || '',
            now,
            id,
          ],
          () => {
            loadPatients();
            resolve();
          },
          (_, error) => {
            console.error('Error updating patient:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Delete patient
  const deletePatient = (id) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM patients WHERE id = ?',
          [id],
          () => {
            loadPatients();
            loadAppointments();
            loadTreatments();
            resolve();
          },
          (_, error) => {
            console.error('Error deleting patient:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Search patients
  const searchPatients = (query) => {
    if (!query.trim()) {
      loadPatients();
      return;
    }
    const database = getDB();
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM patients WHERE fullName LIKE ? OR phoneNumber LIKE ? ORDER BY createdAt DESC',
        [`%${query}%`, `%${query}%`],
        (_, { rows }) => {
          setPatients(rows._array);
        },
        (_, error) => {
          console.error('Error searching patients:', error);
        }
      );
    });
  };

  // Load appointments
  const loadAppointments = () => {
    const database = getDB();
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT a.*, p.fullName as patientName 
         FROM appointments a 
         LEFT JOIN patients p ON a.patientId = p.id 
         ORDER BY a.date ASC, a.time ASC`,
        [],
        (_, { rows }) => {
          setAppointments(rows._array);
        },
        (_, error) => {
          console.error('Error loading appointments:', error);
        }
      );
    });
  };

  // Add appointment
  const addAppointment = (appointmentData) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      const now = new Date().toISOString();
      database.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO appointments (patientId, date, time, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            appointmentData.patientId,
            appointmentData.date,
            appointmentData.time,
            appointmentData.status || 'scheduled',
            appointmentData.notes || '',
            now,
            now,
          ],
          async (_, result) => {
            loadAppointments();
            // Schedule notification if status is scheduled
            if ((appointmentData.status === 'scheduled' || !appointmentData.status) && patients.length > 0) {
              try {
                const patient = patients.find(p => p.id === appointmentData.patientId);
                if (patient) {
                  await scheduleAppointmentReminder({
                    id: result.insertId,
                    patientName: patient.fullName,
                    date: appointmentData.date,
                    time: appointmentData.time,
                  });
                }
              } catch (error) {
                console.error('Error scheduling notification:', error);
              }
            }
            resolve(result.insertId);
          },
          (_, error) => {
            console.error('Error adding appointment:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Update appointment
  const updateAppointment = (id, appointmentData) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      const now = new Date().toISOString();
      database.transaction((tx) => {
        tx.executeSql(
          'UPDATE appointments SET patientId = ?, date = ?, time = ?, status = ?, notes = ?, updatedAt = ? WHERE id = ?',
          [
            appointmentData.patientId,
            appointmentData.date,
            appointmentData.time,
            appointmentData.status,
            appointmentData.notes || '',
            now,
            id,
          ],
          () => {
            loadAppointments();
            resolve();
          },
          (_, error) => {
            console.error('Error updating appointment:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Delete appointment
  const deleteAppointment = (id) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM appointments WHERE id = ?',
          [id],
          () => {
            loadAppointments();
            loadTreatments();
            resolve();
          },
          (_, error) => {
            console.error('Error deleting appointment:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Get appointments by date
  const getAppointmentsByDate = (date) => {
    return appointments.filter(apt => apt.date === date);
  };

  // Load treatments
  const loadTreatments = () => {
    const database = getDB();
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT t.*, p.fullName as patientName, a.date as appointmentDate, a.time as appointmentTime
         FROM treatments t
         LEFT JOIN patients p ON t.patientId = p.id
         LEFT JOIN appointments a ON t.appointmentId = a.id
         ORDER BY t.createdAt DESC`,
        [],
        (_, { rows }) => {
          setTreatments(rows._array);
        },
        (_, error) => {
          console.error('Error loading treatments:', error);
        }
      );
    });
  };

  // Add treatment
  const addTreatment = (treatmentData) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      const now = new Date().toISOString();
      database.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO treatments (appointmentId, patientId, description, prescriptions, cost, followUpDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            treatmentData.appointmentId,
            treatmentData.patientId,
            treatmentData.description,
            treatmentData.prescriptions || '',
            treatmentData.cost || 0,
            treatmentData.followUpDate || null,
            now,
            now,
          ],
          (_, result) => {
            loadTreatments();
            resolve(result.insertId);
          },
          (_, error) => {
            console.error('Error adding treatment:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Update treatment
  const updateTreatment = (id, treatmentData) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      const now = new Date().toISOString();
      database.transaction((tx) => {
        tx.executeSql(
          'UPDATE treatments SET appointmentId = ?, patientId = ?, description = ?, prescriptions = ?, cost = ?, followUpDate = ?, updatedAt = ? WHERE id = ?',
          [
            treatmentData.appointmentId,
            treatmentData.patientId,
            treatmentData.description,
            treatmentData.prescriptions || '',
            treatmentData.cost || 0,
            treatmentData.followUpDate || null,
            now,
            id,
          ],
          () => {
            loadTreatments();
            resolve();
          },
          (_, error) => {
            console.error('Error updating treatment:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Delete treatment
  const deleteTreatment = (id) => {
    return new Promise((resolve, reject) => {
      const database = getDB();
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM treatments WHERE id = ?',
          [id],
          () => {
            loadTreatments();
            resolve();
          },
          (_, error) => {
            console.error('Error deleting treatment:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Get daily revenue
  const getDailyRevenue = (date) => {
    return treatments
      .filter(t => {
        const treatmentDate = t.appointmentDate || t.createdAt?.split('T')[0];
        return treatmentDate === date;
      })
      .reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  };

  // Export patients as JSON
  const exportPatients = () => {
    return JSON.stringify(patients, null, 2);
  };

  // Authentication
  const checkAuth = async () => {
    try {
      const hasPin = await SecureStore.getItemAsync('app_pin');
      if (!hasPin) {
        setIsAuthenticated(true);
        return true;
      }
      return isAuthenticated;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  };

  const setPin = async (pin) => {
    try {
      await SecureStore.setItemAsync('app_pin', pin);
      return true;
    } catch (error) {
      console.error('Error setting PIN:', error);
      return false;
    }
  };

  const verifyPin = async (pin) => {
    try {
      const storedPin = await SecureStore.getItemAsync('app_pin');
      if (storedPin === pin) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    isAuthenticated,
    isDbInitialized,
    patients,
    appointments,
    treatments,
    addPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    loadPatients,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
    loadAppointments,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    loadTreatments,
    getDailyRevenue,
    exportPatients,
    checkAuth,
    setPin,
    verifyPin,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

