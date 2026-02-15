# Screens Overview

This document provides an overview of all screens in the Clinic Management App.

## Navigation Structure

The app uses a **Bottom Tab Navigation** with 4 main sections:
1. **Patients** - Patient management
2. **Appointments** - Appointment scheduling
3. **Treatments** - Treatment tracking
4. **Settings** - App settings and revenue dashboard

Each main section has a **Stack Navigator** for detail and add/edit screens.

---

## 1. Patients Section

### PatientsScreen (List)
- **Purpose**: Main patient list view
- **Features**:
  - Search bar to filter patients by name or phone
  - List of all patients with key information
  - Tap patient card to view details
  - Delete button on each card
  - Empty state with "Add First Patient" button
- **FAB**: Opens Add Patient screen

### AddPatientScreen
- **Purpose**: Add new patient or edit existing
- **Fields**:
  - Full Name* (required)
  - Age* (required, numeric)
  - Phone Number* (required)
  - Nen Type (optional)
  - Medical Notes (multiline)
- **Validation**: Real-time form validation with error messages
- **Actions**: Save/Cancel

### PatientDetailScreen
- **Purpose**: View detailed patient information
- **Displays**:
  - Patient name, age, phone
  - Nen type badge (if available)
  - Medical notes
  - Statistics (appointment count, treatment count)
  - Recent appointments (last 3)
- **Actions**:
  - Edit Patient button
  - Delete Patient button (with confirmation)

---

## 2. Appointments Section

### AppointmentsScreen
- **Purpose**: View and manage appointments
- **Features**:
  - **Day View Tab**: Shows appointments for selected date
  - **Calendar Tab**: Interactive calendar with marked dates
  - Date selector showing current selected date
  - Appointment cards with:
    - Patient name
    - Time
    - Status badge (scheduled/completed/canceled)
    - Notes preview
  - Color-coded status indicators
- **FAB**: Opens Add Appointment screen

### AddAppointmentScreen
- **Purpose**: Create or edit appointment
- **Fields**:
  - Patient* (dropdown picker)
  - Date* (date picker, future dates only)
  - Time* (time picker)
  - Status (dropdown: scheduled/completed/canceled)
  - Notes (multiline)
- **Validation**: Ensures patient and date/time are selected
- **Auto-scheduling**: Automatically schedules notification reminder (1 hour before)

---

## 3. Treatments Section

### TreatmentsScreen
- **Purpose**: List all treatments
- **Features**:
  - Treatment cards showing:
    - Patient name
    - Treatment description
    - Appointment date
    - Cost (highlighted)
  - Delete button on each card
  - Empty state message
- **FAB**: Opens Add Treatment screen

### AddTreatmentScreen
- **Purpose**: Record new treatment or edit existing
- **Fields**:
  - Appointment* (dropdown, can be pre-selected from appointment)
  - Patient* (auto-filled if appointment selected)
  - Description* (required, multiline)
  - Prescriptions (multiline)
  - Cost* (required, decimal)
  - Follow-up Date (optional, date picker)
- **Validation**: Ensures required fields are filled
- **Smart linking**: Automatically links patient when appointment is selected

### TreatmentDetailScreen
- **Purpose**: View treatment details
- **Displays**:
  - Patient name
  - Full description
  - Prescriptions (if any)
  - Cost (large, highlighted)
  - Appointment date
  - Follow-up date (if set)
- **Actions**:
  - Edit Treatment button
  - Delete Treatment button

---

## 4. Settings Section

### SettingsScreen
- **Purpose**: App configuration and data management
- **Sections**:

#### Revenue Summary Card
- Today's revenue (from treatments today)
- Total revenue (all-time)
- Large, easy-to-read numbers

#### Appearance
- **Dark Mode Toggle**: Switch between light and dark themes
- Instant theme change across entire app

#### Security
- **Biometric Lock Toggle**: Enable/disable fingerprint/face ID
  - Only shown if device supports biometrics
  - Requires authentication to enable
- **PIN Lock Toggle**: Enable/disable PIN protection
  - When enabling: Shows PIN input fields
  - PIN must be 4-6 digits
  - Requires confirmation
  - When disabling: Confirmation dialog

#### Data
- **Export Patients Data**: 
  - Exports all patient data as JSON
  - Uses native share functionality
  - Can share via email, messaging, etc.

---

## 5. Authentication

### LockScreen
- **Purpose**: Secure app access
- **Features**:
  - PIN input field (secure text entry)
  - Unlock button
  - Biometric button (if enabled and available)
- **Auto-unlock**: Attempts biometric authentication on screen load
- **Validation**: Shows error for incorrect PIN
- **Design**: Centered, clean lock interface

---

## Common UI Patterns

### Floating Action Button (FAB)
- **Location**: Bottom right, above tab bar
- **Purpose**: Quick access to "Add" actions
- **Screens**: Patients, Appointments, Treatments
- **Icon**: Plus icon

### Bottom Navigation
- **Icons**: 
  - Patients: People icon
  - Appointments: Calendar icon
  - Treatments: Medical icon
  - Settings: Settings icon
- **Active State**: Highlighted with primary color
- **Badges**: Can show counts (future enhancement)

### Cards
- **Style**: Rounded corners, shadow, padding
- **Interaction**: Tap to view details
- **Actions**: Inline delete buttons
- **Responsive**: Adapts to dark/light mode

### Forms
- **Validation**: Real-time with error messages
- **Required Fields**: Marked with asterisk (*)
- **Keyboard**: Appropriate keyboard types (numeric, phone, etc.)
- **Multiline**: For longer text inputs

### Empty States
- **Design**: Large icon, message, action button
- **Purpose**: Guide users to add first item
- **Screens**: Patients, Appointments, Treatments

---

## Navigation Flow

```
App Launch
  ↓
Lock Screen (if PIN set)
  ↓
Main Tab Navigator
  ├─ Patients Tab
  │   ├─ Patients List
  │   ├─ Add/Edit Patient
  │   └─ Patient Detail
  │
  ├─ Appointments Tab
  │   ├─ Appointments List (Day/Calendar View)
  │   ├─ Add/Edit Appointment
  │   └─ Appointment Detail
  │
  ├─ Treatments Tab
  │   ├─ Treatments List
  │   ├─ Add/Edit Treatment
  │   └─ Treatment Detail
  │
  └─ Settings Tab
      └─ Settings Screen
```

---

## Data Flow

1. **Database**: SQLite stores all data locally
2. **State Management**: Context API provides global state
3. **Real-time Updates**: Changes reflect immediately across screens
4. **Offline-first**: All operations work without internet
5. **Notifications**: Scheduled when appointments are created

---

## User Experience Highlights

- **Mobile-first**: Optimized for phone screens, thumb-friendly
- **Fast**: Instant navigation, no loading delays
- **Intuitive**: Clear labels, familiar patterns
- **Accessible**: Large touch targets, readable text
- **Responsive**: Smooth animations, immediate feedback
- **Secure**: PIN/biometric protection
- **Flexible**: Dark mode, customizable settings

---

## Screen Transitions

- **Push**: Slide in from right (detail screens)
- **Modal**: Slide up from bottom (add/edit screens)
- **Tab Switch**: Instant (no animation)
- **Back**: Slide out to right

All transitions are smooth and native-feeling.

