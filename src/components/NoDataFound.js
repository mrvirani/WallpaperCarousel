import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoDataFound = ({ message = "No Data Found" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',  // Center horizontally
    backgroundColor: '#f4f4f4',  // Light background color
  },
  message: {
    fontSize: 18,
    color: '#888',  // Grey text color to indicate no data
    textAlign: 'center',
    padding: 20,
  },
});

export default NoDataFound;
