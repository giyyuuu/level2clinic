# Clinic Management App

A mobile-first clinic management application built with React Native (Expo) for Leorio's medical clinic. This app provides comprehensive patient management, appointment scheduling, and treatment tracking capabilities.

## 🎯 Features

### Core Features

1. **Patient Management**
   - Add, edit, view, and delete patients
   - Search patients by name or phone number
   - Patient details include: name, age, phone, Nen type (optional), medical notes
   - View patient history and statistics

2. **Appointment Scheduling**
   - Create and manage appointments
   - Calendar view and daily agenda
   - Appointment status tracking (scheduled, completed, canceled)
   - Local notifications for appointment reminders (1 hour before)
   - Assign appointments to patients

3. **Treatment Tracking**
   - Record treatments per appointment
   - Track prescriptions, costs, and follow-up dates
   - Link treatments to patients and appointments
   - View treatment history

4. **Security**
   - PIN lock protection
   - Biometric authentication (fingerprint/face ID)
   - Secure local storage

5. **Additional Features**
   - Dark mode support
   - Daily revenue summary dashboard
   - Export patient data as JSON
   - Offline-first (no backend required)
   - SQLite local database

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Context API
- **UI Components**: Custom components with theme support
- **Notifications**: Expo Notifications
- **Security**: Expo Secure Store + Local Authentication
- **Date Handling**: date-fns
- **Calendar**: react-native-calendars

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android emulator)
- Physical Android device OR Android emulator

## 🚀 Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd clinic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npm start
   # or
   expo start
   ```

## 📱 Running on Android

### Option 1: Android Emulator

1. **Set up Android Studio:**
   - Install Android Studio
   - Create an Android Virtual Device (AVD)
   - Start the emulator

2. **Run the app:**
   ```bash
   npm run android
   # or
   expo start --android
   ```

### Option 2: Physical Device

1. **Install Expo Go app** on your Android device from Google Play Store

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Scan the QR code** with Expo Go app or press `a` in the terminal

## 📁 Project Structure

```
clinic/
├── App.js                 # Main app entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── babel.config.js        # Babel configuration
├── database/
│   └── db.js             # SQLite database setup and queries
├── context/
│   ├── AppContext.js     # Main app state management
│   └── ThemeContext.js   # Theme and colors management
├── screens/
│   ├── PatientsScreen.js
│   ├── AddPatientScreen.js
│   ├── PatientDetailScreen.js
│   ├── AppointmentsScreen.js
│   ├── AddAppointmentScreen.js
│   ├── TreatmentsScreen.js
│   ├── AddTreatmentScreen.js
│   ├── TreatmentDetailScreen.js
│   ├── SettingsScreen.js
│   └── LockScreen.js
├── components/
│   ├── Button.js
│   ├── Input.js
│   ├── Card.js
│   └── FAB.js
├── navigation/
│   └── AppNavigator.js   # Navigation setup
└── services/
    └── notifications.js  # Notification handling
```

## 🗄️ Database Schema

### Patients Table
- `id` (INTEGER PRIMARY KEY)
- `fullName` (TEXT)
- `age` (INTEGER)
- `phoneNumber` (TEXT)
- `nenType` (TEXT, optional)
- `medicalNotes` (TEXT)
- `createdAt` (TEXT)
- `updatedAt` (TEXT)

### Appointments Table
- `id` (INTEGER PRIMARY KEY)
- `patientId` (INTEGER, FOREIGN KEY)
- `date` (TEXT)
- `time` (TEXT)
- `status` (TEXT: scheduled/completed/canceled)
- `notes` (TEXT)
- `createdAt` (TEXT)
- `updatedAt` (TEXT)

### Treatments Table
- `id` (INTEGER PRIMARY KEY)
- `appointmentId` (INTEGER, FOREIGN KEY)
- `patientId` (INTEGER, FOREIGN KEY)
- `description` (TEXT)
- `prescriptions` (TEXT)
- `cost` (REAL)
- `followUpDate` (TEXT)
- `createdAt` (TEXT)
- `updatedAt` (TEXT)

## 📊 Example Data

The app comes with seeded example data:
- 4 sample patients (Gon, Killua, Kurapika, Leorio)
- Sample appointments
- Sample treatments

Data is automatically seeded on first app launch.

## 🎨 UI/UX Features

- **Mobile-first design**: Optimized for phone screens
- **Bottom navigation**: Easy access to main sections
- **Floating Action Button (FAB)**: Quick add actions
- **Dark mode**: Automatic theme switching
- **Smooth transitions**: Native-feeling animations
- **Form validation**: Input validation with error messages
- **Search functionality**: Quick patient search
- **Calendar integration**: Visual appointment calendar

## 🔒 Security Features

1. **PIN Lock**: Set a 4-6 digit PIN to lock the app
2. **Biometric Authentication**: Use fingerprint or face ID (if available)
3. **Secure Storage**: Sensitive data stored using Expo Secure Store

To enable security:
- Go to Settings → Security
- Toggle PIN Lock or Biometric Lock

## 📤 Export Data

Export patient data as JSON:
- Go to Settings → Data
- Tap "Export Patients Data"
- Share the JSON file

## 💰 Revenue Dashboard

View daily and total revenue in the Settings screen:
- Today's revenue from treatments
- Total revenue from all treatments

## 🔔 Notifications

Appointment reminders are automatically scheduled:
- 1 hour before each appointment
- Requires notification permissions
- Works even when app is closed

## 🐛 Troubleshooting

### Database Issues
If you encounter database errors:
1. Clear app data: Settings → Apps → Clinic Management → Clear Data
2. Reinstall the app

### Notification Issues
- Ensure notification permissions are granted
- Check device notification settings
- Physical device required for notifications (not available in emulator)

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

## 📝 Development Notes

- **State Management**: Uses React Context API for global state
- **Database**: SQLite with expo-sqlite (offline-first)
- **Navigation**: React Navigation with bottom tabs and stack navigators
- **Theming**: Dynamic theme system with light/dark modes
- **Forms**: Custom input components with validation
- **Error Handling**: Try-catch blocks and user-friendly error messages

## 🚧 Future Enhancements

Potential improvements:
- Patient photo uploads
- Treatment templates
- Advanced reporting and analytics
- Multi-language support
- Cloud backup/sync
- Appointment conflict detection
- Recurring appointments

## 📄 License

This project is built for Leorio's medical clinic.

## 👨‍⚕️ Credits

Built with ❤️ for medical professionals who need efficient clinic management tools.

---

**Note**: This is a production-ready mobile application optimized for Android devices. All data is stored locally on the device using SQLite.

