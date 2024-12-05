import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#cccccc1c',
    marginTop: 16,
    width: '100%',
    borderRadius: 100,
  },
});

export default Divider;
