import Ionicons from '@expo/vector-icons/Ionicons';
import React, {useEffect, useState} from 'react';
import { ScrollView, StyleSheet, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../container/AppProvider';
import { useIsFocused } from '@react-navigation/native';
import {URL, COLOR, AVATAR_DEFAULT} from '@/CONST';
import { router } from 'expo-router';
import { Image } from 'react-native'; 
import io, { Socket } from 'socket.io-client';
import * as Notifications from 'expo-notifications';

const scheduleRepeatingNotifications = async (message: string, intervalInSeconds:number, repeatCount:number) => {
  for (let i = 0; i < repeatCount; i++) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notification",
        body: `${message}`,
        sound: true,
      },
      trigger: {
        seconds: intervalInSeconds * (i + 1), // Schedule each one with an increasing delay
      } as any,
    });
  }
};

// Call the function

export default function Doctor(){
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState<boolean>(true);
    const {sharedData} = useAppContext();
    const [data, setData] = useState<any[]>([]);
    const [status, setStatus] = useState<string>('accepted');

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
      if (sharedData === null || socket) return;
      const socketInstance: Socket = io(URL);

      socketInstance.on('connection', () => {
        socketInstance.emit('listen', sharedData._id);
      });

      socketInstance.on('emergency', (data: any) => {
        console.log('Emergency data: ', data);
        scheduleRepeatingNotifications("Bệnh nhân " + data.fullname + " có tình trạng sức khỏe xấu Heart Rate: " + data.hr + " SpO2: " + data.spo2, 2, 1);
      });

      setSocket(socketInstance);
      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    }, [sharedData]);

    useEffect(() => {
      if(sharedData === null) return;
      setLoading(true);
      fetch(URL + '/user/getAssignment/' + sharedData._id + "/" + status, {
          method: 'GET',
      })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        console.log('🚀 ~ Doctor ~ list doctor', data);
      });
    }, [status, sharedData]);
    
    if(loading) return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLOR.PRIMARY}/>
        <Text style={{color: COLOR.PRIMARY, textAlign:'center', fontSize: 20, fontWeight:'bold', marginTop: 20}}> Loading... </Text>
      </View>
    );

    const onClick = (_id: string) => {
      router.navigate({ pathname: '/patientInfoDetail', params: {_id} });
    }

    const patientHealth = (_id: string) => {
      router.navigate({ pathname: '/patientHealth', params: {_id} });
    }

    return (
        <ScrollView>
          <View style={{flexDirection: 'row', marginVertical: 20, marginHorizontal: 15, borderRadius: 20, overflow: 'hidden'}}>
            <TouchableOpacity style={{flex:1, padding: 10, backgroundColor:status=="accepted"?COLOR.PRIMARY:COLOR.LIGHT_GRAY}} onPress={() => setStatus("accepted")}>
              <Text style={{fontSize: 15, fontWeight: 'bold', textAlign:'center', color:status=="accepted"?COLOR.WHITE:COLOR.PRIMARY}}> My Patient </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, padding: 10, backgroundColor:status=="pending"?COLOR.PRIMARY:COLOR.LIGHT_GRAY}} onPress={() => setStatus("pending")}>
              <Text style={{fontSize: 15, fontWeight: 'bold', textAlign:'center', color:status=="pending"?COLOR.WHITE:COLOR.PRIMARY}}> All Request </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, padding: 10, backgroundColor:status=="history"?COLOR.PRIMARY:COLOR.LIGHT_GRAY}} onPress={() => setStatus("history")}>
              <Text style={{fontSize: 15, fontWeight: 'bold', textAlign:'center', color:status=="history"?COLOR.WHITE:COLOR.PRIMARY}}> History </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, justifyContent: 'flex-end', paddingVertical: 16, padding: 15}}>
            {data.map((item, index) => (
              <TouchableOpacity key={index} style={styles.infoCard} onPress={() => onClick(item?._id)}>
                <Image source={{ uri: AVATAR_DEFAULT}} style={styles.image} />
                <View style={{display:"flex", justifyContent: "space-around", height:'100%'}}>
                  <Text style={styles.txt}> <Ionicons name="person" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.patient?.user?.fullname}</Text>
                  <Text style={styles.txt}> <Ionicons name="calendar" size={16} color={COLOR.PRIMARY} style={{}} /> {new Date(item?.patient?.user?.dob).toLocaleDateString()||""}</Text>
                  <Text style={styles.txt}> <Ionicons name="location" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.patient?.user?.address}</Text>
                </View>
                
                  <View style={{marginLeft: 'auto'}}>
                    {status=="accepted"&&
                      <TouchableOpacity style={{backgroundColor: COLOR.PRIMARY, padding: 10, borderRadius: 20}} onPress={() => patientHealth(item?.patient?._id)}>
                        <Ionicons name="bar-chart" size={20} color={COLOR.WHITE} style={{paddingHorizontal: 10, paddingVertical: 5}} />
                      </TouchableOpacity>
                    }
                    {status=="pending"&& <Text style={{paddingHorizontal: 10, paddingVertical: 5, color:COLOR.WHITE, backgroundColor:COLOR.PRIMARY, borderRadius:20}}> Chờ xác nhận </Text>}
                    {item?.status=="rejected"&& <Text style={{paddingHorizontal: 10, paddingVertical: 5, color:COLOR.WHITE, backgroundColor:COLOR.BLUE, borderRadius:20}}> Đã từ chối </Text>}
                    {item?.status=="disconnected"&& <Text style={{paddingHorizontal: 10, paddingVertical: 5, color:COLOR.WHITE, backgroundColor:COLOR.RED, borderRadius:20}}> Đã hủy kết nối </Text>}
                  </View>
             </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  icon: {
    padding: 10,
    color: '#2489FF',
  },
  txt: {
    color: COLOR.BLACK,
    fontSize: 14,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: "flex-start",
    alignItems: 'center',
    gap: 10
  },

  image: {
    width: 75,
    height: 100,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLOR.PRIMARY,
  },

  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    marginBottom: 10,
    backgroundColor: COLOR.LIGHT_GRAY,
    padding: 10,
    borderRadius: 20,
  },
});

