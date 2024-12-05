import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLOR } from '@/CONST';

interface IFiledInfoUser {
  label: string;
  value: string;
}

const FiledInfoUser: React.FC<IFiledInfoUser> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.txtLabel}>{label}</Text>
      <Text style={[styles.txtLabel, styles.txtValue]}>{value}</Text>
    </View>
  );
};

export default FiledInfoUser;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  txtLabel: {
    color: COLOR.BLACK,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  txtValue: {
    opacity: 0.8,
  },
});
