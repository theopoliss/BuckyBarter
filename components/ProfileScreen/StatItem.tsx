import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatItemProps {
  value: string | number;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6E6E6E',
  },
});

export default StatItem; 