import * as SQLite from 'expo-sqlite';

const dbName = 'clinic.db';

let db = null;

export const getDB = () => {
  if (!db) {
    db = SQLite.openDatabase(dbName);
  }
  return db;
};

export const initDatabase = () => {
  const database = getDB();
  
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Patients table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          age INTEGER NOT NULL,
          phoneNumber TEXT NOT NULL,
          nenType TEXT,
          medicalNotes TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );`,
        [],
        () => console.log('Patients table created'),
        (_, error) => {
          console.error('Error creating patients table:', error);
          reject(error);
        }
      );

      // Appointments table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patientId INTEGER NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'scheduled',
          notes TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log('Appointments table created'),
        (_, error) => {
          console.error('Error creating appointments table:', error);
          reject(error);
        }
      );

      // Treatments table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS treatments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          appointmentId INTEGER NOT NULL,
          patientId INTEGER NOT NULL,
          description TEXT NOT NULL,
          prescriptions TEXT,
          cost REAL NOT NULL DEFAULT 0,
          followUpDate TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE CASCADE,
          FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log('Treatments table created'),
        (_, error) => {
          console.error('Error creating treatments table:', error);
          reject(error);
        }
      );

      // Settings table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );`,
        [],
        () => console.log('Settings table created'),
        (_, error) => {
          console.error('Error creating settings table:', error);
          reject(error);
        }
      );
    }, (error) => {
      console.error('Transaction error:', error);
      reject(error);
    }, () => {
      console.log('Database initialized successfully');
      resolve();
    });
  });
};

export const seedDatabase = () => {
  const database = getDB();
  const now = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if data already exists
      tx.executeSql(
        'SELECT COUNT(*) as count FROM patients',
        [],
        (_, { rows }) => {
          if (rows.item(0).count > 0) {
            console.log('Database already seeded');
            resolve();
            return;
          }

          // Seed patients
          const patients = [
            ['Gon Freecss', 12, '+1234567890', 'Enhancement', 'Young hunter with great potential', now, now],
            ['Killua Zoldyck', 12, '+1234567891', 'Transmutation', 'Assassin with electrical nen', now, now],
            ['Kurapika Kurta', 19, '+1234567892', 'Conjuration', 'Chain user seeking revenge', now, now],
            ['Leorio Paradinight', 19, '+1234567893', 'Enhancement', 'Medical student and hunter', now, now],
          ];

          patients.forEach((patient) => {
            tx.executeSql(
              'INSERT INTO patients (fullName, age, phoneNumber, nenType, medicalNotes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
              patient
            );
          });

          // Seed appointments
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          const dayAfter = new Date();
          dayAfter.setDate(dayAfter.getDate() + 2);
          const dayAfterStr = dayAfter.toISOString().split('T')[0];

          tx.executeSql(
            'INSERT INTO appointments (patientId, date, time, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [1, tomorrowStr, '10:00', 'scheduled', 'Regular checkup', now, now]
          );
          tx.executeSql(
            'INSERT INTO appointments (patientId, date, time, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [2, tomorrowStr, '14:00', 'scheduled', 'Follow-up treatment', now, now]
          );
          tx.executeSql(
            'INSERT INTO appointments (patientId, date, time, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [3, dayAfterStr, '11:00', 'scheduled', 'Initial consultation', now, now]
          );

          // Seed treatments
          tx.executeSql(
            'INSERT INTO treatments (appointmentId, patientId, description, prescriptions, cost, followUpDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [1, 1, 'General health checkup', 'Vitamin supplements', 50.00, tomorrowStr, now, now]
          );
        },
        (_, error) => {
          console.error('Error seeding database:', error);
          reject(error);
        }
      );
    }, (error) => {
      console.error('Transaction error:', error);
      reject(error);
    }, () => {
      console.log('Database seeded successfully');
      resolve();
    });
  });
};

