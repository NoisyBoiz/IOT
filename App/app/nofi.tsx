// import React, { useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import BackgroundFetch from 'react-native-background-fetch';

// // Register headless task for background fetch
// const task = async (event: any) => {
//   console.log(`Background task with ID ${event.taskId} executed`);

//   // Trigger a notification in the background (if needed)
//   try {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Thông báo mới!",
//         body: "Bạn có một thông báo mới từ ứng dụng.",
//         sound: true,
//       },
//       trigger: {
//         seconds: 2,  // Trigger in 2 seconds
//         repeats: true, // Repeat every 2 seconds (for example)
//       } as Notifications.TimeIntervalTriggerInput,
//     });
//   } catch (error) {
//     console.error('Error scheduling notification:', error);
//   }

//   // Finish the background task
//   BackgroundFetch.finish(event.taskId);
// };

// // Register the background task when the app starts
// BackgroundFetch.registerHeadlessTask(task);

// const App: React.FC = () => {
//   useEffect(() => {
//     // Set up foreground notification listener
//     const foregroundSubscription = Notifications.addNotificationReceivedListener(
//       (notification) => {
//         console.log('Notification received in foreground:', notification);
//       }
//     );

//     // Set up background notification response listener
//     const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         console.log('Notification received in background:', response);
//       }
//     );

//     // Clean up listeners on component unmount
//     return () => {
//       foregroundSubscription.remove();
//       backgroundSubscription.remove();
//     };
//   }, []);

//   // Trigger notification manually when the button is pressed
//   const triggerNotification = async () => {
//     try {
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Thông báo mới!",
//           body: "Bạn có một thông báo mới từ ứng dụng.",
//           sound: true,
//         },
//         trigger: {
//           seconds: 2,  
//           repeats: true,
//         } as Notifications.TimeIntervalTriggerInput,
//       });
//     } catch (error) {
//       console.error("Error scheduling notification:", error);
//     }
//   };

//   useEffect(() => {
//     // Configure background fetch
//     BackgroundFetch.configure(
//       {
//         minimumFetchInterval: 15, // Minimum interval in minutes
//         stopOnTerminate: false, // Continue running after the app is terminated
//         startOnBoot: true, // Start when the device boots up
//       },
//       async (taskId) => {
//         console.log(`Background fetch task with ID ${taskId} executed`);
//         BackgroundFetch.finish(taskId); // Signal task completion
//       },
//       (error) => {
//         console.error("Background fetch failed to start:", error);
//       }
//     );
//   }, []);

//   return (
//     <View>
//       <Button title="Gửi Thông Báo" onPress={triggerNotification} />
//     </View>
//   );
// };

// export default App;
