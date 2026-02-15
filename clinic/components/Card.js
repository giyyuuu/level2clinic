import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const Card = ({ children, onPress, style }) => {
  const { colors } = useTheme();
  
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadow }, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

