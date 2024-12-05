import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Not Found' }} />
      <View>
        <Text>Not Found</Text>
        <Link href="/"> Back to Home Screen</Link>
      </View>
    </>
  );
};

export default NotFoundScreen;
const styles = StyleSheet.create({});
