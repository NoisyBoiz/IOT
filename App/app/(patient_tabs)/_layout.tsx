import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from "../../CONST";

const PatientTabs = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#FFFFFF', },
        headerStyle: { backgroundColor: COLOR.BACKGROUND },
        headerShadowVisible: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={'bar-chart'} color={focused ? COLOR.PRIMARY : COLOR.LIGHT_GRAY} size={24} />
          ),
          headerLeft: () =>
            <>
              <Ionicons name="bar-chart" size={24} color={COLOR.PRIMARY} style={{ marginLeft: 15 }} />,
              <Text style={styles.txt}> Sức khỏe </Text>
            </>
        }}
      />

      <Tabs.Screen
        name="doctor"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={"medkit-outline"} color={focused ? COLOR.PRIMARY : COLOR.LIGHT_GRAY} size={24} />
          ),
          headerLeft: () => <>
            <Ionicons name="medkit-outline" size={24} color={COLOR.PRIMARY} style={{ marginLeft: 15 }} />,
            <Text style={styles.txt}> Bác sĩ </Text>
          </>
        }}
      />

      <Tabs.Screen
        name="chatbot"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={'robot-excited-outline'} color={focused ? COLOR.PRIMARY : COLOR.LIGHT_GRAY} size={24} />
          ),
          headerLeft: () => (
            <>
              <MaterialCommunityIcons name="robot-excited-outline" size={24} color={COLOR.PRIMARY} style={{ marginLeft: 15 }} />,
              <Text style={styles.txt}> Chatbot </Text>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={'person-circle-outline'} color={focused ? COLOR.PRIMARY : COLOR.LIGHT_GRAY} size={24} />
          ),
          headerLeft: () => <>
            <Ionicons name="person-circle-sharp" size={24} color={COLOR.PRIMARY} style={{ marginLeft: 15 }} />
            <Text style={styles.txt}> Profile </Text>
          </>
        }}
      />
    </Tabs>
  );
};

export default PatientTabs;

const styles = StyleSheet.create({
  txt: {
    color: COLOR.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold'
  }
});