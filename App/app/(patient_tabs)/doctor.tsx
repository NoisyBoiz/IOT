import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../container/AppProvider';
import { useIsFocused } from '@react-navigation/native';
import { URL, COLOR } from '@/CONST';
import { router } from 'expo-router';
import { Image } from 'react-native';

export default function Doctor() {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState<boolean>(true);
  const { sharedData } = useAppContext();
  const [doctorData, setDoctorData] = useState<any[]>([]);
  const [myDoctor, setMyDoctor] = useState<any[]>([]);
  const [showList, setShowList] = useState<boolean>(true);

  useEffect(() => {
    if (showList) {
      setLoading(true);
      fetch(URL + '/user/listDoctor', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setDoctorData(data);
          setLoading(false);
          console.log('🚀 ~ Doctor ~ list doctor', data);
        });
    }

    if (!showList) {
      if (sharedData === null) return;
      setLoading(true);
      fetch(URL + '/user/myDoctor/' + sharedData._id, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setMyDoctor(data);
          setLoading(false);
          console.log('🚀 ~ Doctor ~ my doctor', data);
        });
    }
  }, [showList, isFocused]);

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      <Text style={{ color: COLOR.PRIMARY, textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 20, }}> Loading... </Text>
    </View>
  );

  const onClick = (_id: string) => {
    router.navigate({ pathname: '/doctorInfoDetail', params: { _id } });
  }

  return (
    <ScrollView>
      <View style={{ flexDirection: 'row', marginVertical: 20, marginHorizontal: 15, borderRadius: 20, overflow: 'hidden' }}>
        <TouchableOpacity style={{ width: '50%', padding: 10, backgroundColor: showList ? COLOR.PRIMARY : COLOR.LIGHT_GRAY }} onPress={() => setShowList(true)}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', color: showList ? COLOR.WHITE : COLOR.PRIMARY }}> All Doctor </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '50%', padding: 10, backgroundColor: !showList ? COLOR.PRIMARY : COLOR.LIGHT_GRAY }} onPress={() => setShowList(false)}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', color: !showList ? COLOR.WHITE : COLOR.PRIMARY }}> My Doctor </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end', paddingVertical: 16, padding: 15 }}>
        {showList ?
          doctorData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.infoCard} onPress={() => onClick(item?._id)}>
              <Image source={{ uri: item?.user?.image?item?.user?.image:"https://cdn-icons-png.flaticon.com/512/1021/1021799.png" }} style={styles.image} />
              <View style={{ display: "flex", justifyContent: "space-around", height: '100%' }}>
                <Text style={styles.txt}> <Ionicons name="person" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.user?.fullname} </Text>
                <Text style={styles.txt}> <Ionicons name="medkit" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.specialty} </Text>
                <Text style={styles.txt}> <Ionicons name="location" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.user?.address} </Text>
              </View>
            </TouchableOpacity>
          )) :
          myDoctor.map((item, index) => (
            <TouchableOpacity key={index} style={styles.infoCard} onPress={() => onClick(item?.doctor?._id)}>
              <Image source={{ uri: item?.doctor?.user?.image?item?.doctor?.user?.image:"https://cdn-icons-png.flaticon.com/512/1021/1021799.png" }} style={styles.image} />
              <View style={{ display: "flex", justifyContent: "space-around", height: '100%' }}>
                <Text style={styles.txt}> <Ionicons name="person" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.doctor?.user?.fullname} </Text>
                <Text style={styles.txt}> <Ionicons name="medkit" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.doctor?.specialty} </Text>
                <Text style={styles.txt}> <Ionicons name="location" size={16} color={COLOR.PRIMARY} style={{}} /> {item?.doctor?.user?.address} </Text>
              </View>

              <View style={{ marginLeft: 'auto' }}>
                <Text style={{ paddingHorizontal: 10, paddingVertical: 5, color: COLOR.WHITE, borderRadius: 20, backgroundColor: item?.status == "pending" ? COLOR.PRIMARY : item?.status == "accepted" ? COLOR.GREEN : item?.status == "rejected" ? COLOR.BLUE : COLOR.RED }}>{item?.status == "pending" ? "Chờ xác nhận" : item?.status == "accepted" ? "Đã kết nối" : item?.status == "rejected" ? "Đã từ chối" : "Đã hủy kết nối"}</Text>
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
    gap: 6,
    width: '100%',
    marginBottom: 10,
    backgroundColor: COLOR.LIGHT_GRAY,
    padding: 10,
    borderRadius: 20,
  },
});

