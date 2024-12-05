import {AppProvider} from '@/container/AppProvider';
import {Stack} from 'expo-router';
import { COLOR } from '@/CONST';
import { useEffect} from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}


export default function RootLayout() {

  useEffect(() => {
  
    registerForPushNotificationsAsync().then(token => console.log(token));

    const askForPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission not granted');
      }
    };
    askForPermissions();
  }, []);

   

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(patient_tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(doctor_tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="editProfile" options={{
          title: 'Edit Profile',
          headerBackTitle: 'Back',
          headerTintColor: COLOR.PRIMARY,
          headerTitleStyle: {
            color: COLOR.PRIMARY
          }
        }} />

         <Stack.Screen name="doctorInfoDetail" options={{
          title: 'Doctor Detail',
          headerBackTitle: 'Back',
          headerTintColor: COLOR.PRIMARY,
          headerTitleStyle: {
            color: COLOR.PRIMARY
          }
        }} />

        <Stack.Screen name="patientInfoDetail" options={{
          title: 'Patient Detail',
          headerBackTitle: 'Back',
          headerTintColor: COLOR.PRIMARY,
          headerTitleStyle: {
            color: COLOR.PRIMARY
          }
        }} />

        <Stack.Screen name="patientHealth" options={{
          title: 'Patient Health',
          headerBackTitle: 'Back',
          headerTintColor: COLOR.PRIMARY,
          headerTitleStyle: {
            color: COLOR.PRIMARY
          }
        }} />

      </Stack>
    </AppProvider>
  );
}
