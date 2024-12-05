import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface IButton {
  label: string;
  style?: ViewStyle;
  onPress?: () => void;
}
const Button: React.FC<IButton> = ({ label, style, onPress }) => {
  return (
    <TouchableOpacity style={[styles.pressable, style]} onPress={onPress}>
      <Text style={styles.txt}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  pressable: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
    borderRadius: 4,
  },
  txt: {
    color: 'black',
    fontSize: 14,
  },
});
