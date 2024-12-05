import Divider from '@/components/Divider';
import FiledInfoUser from '@/components/FiledInfoUser';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../container/AppProvider';
import { URL, COLOR } from '@/CONST';
import { useRoute } from '@react-navigation/native';

export default function Profile(){
  const {sharedData, setSharedData} = useAppContext();
  const route = useRoute();
  const {_id}:any = route.params;

  const [loading, setLoading] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<any>();

  useEffect(() => {
    console.log('🚀 ~ file: doctorInforDetail.tsx ~ line 10 ~ Profile ~ data', _id, sharedData?._id);
    if(_id !== undefined && sharedData !== null){
      fetch(URL + '/user/getDoctorById/'+ sharedData._id + "/" + _id, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((data) => {
        setDoctor(data);
        console.log('🚀 ~ file: doctorInforDetail.tsx ~ line 10 ~ Profile ~ data', data);
      });
    }
  }, [_id, sharedData]);


  const sendRequest = async () => {
    setLoading(true);
    const res = await fetch(URL + '/user/requestAssignment/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          _id: sharedData?._id,
          doctor_id: _id,
      }),
    })

    if(res.ok) Alert.alert('Thành công', 'Yêu cầu đã được gửi');
    else{
      try{
        const data = await res.json();
        Alert.alert('Error', data.message);
      }
      catch(e){
        Alert.alert('Error', 'Something went wrong');
      }
    }
    setLoading(false);
    router.replace('/(patient_tabs)/doctor');
  };

  const cancelRequest = async () => {
    setLoading(true);
    const res = await fetch(URL + '/user/responseAssignment/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          _id: doctor?.assignment?._id,
          status: "disconnected",
      }),
    })

    if(res.ok) Alert.alert('Thành công', 'Yêu cầu đã được gửi');
    else{
      try{
        const data = await res.json();
        Alert.alert('Error', data.message);
      }
      catch(e){
        Alert.alert('Error', 'Something went wrong');
      }
    }
    setLoading(false);
    router.replace('/(patient_tabs)/doctor');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{uri: doctor?.user?.image?doctor?.user?.image:'https://cdn.glitch.global/ee29f481-23c3-4bdb-a029-c84ebe6fdfef/avatar.png?v=1732878991705',}}style={{width: 130,height: 130,marginBottom: 20,borderRadius: 180,backgroundColor: COLOR.PRIMARY}} />
        
        {doctor?.assignment?.status=="pending"&&
        <>
            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', width: '100%',marginTop: 16,}}>
                <Text style={{color: COLOR.BLACK, fontSize: 16, textTransform: 'capitalize'}}>Trạng thái</Text>
                <Text style={{color: COLOR.WHITE, textAlign:"center", fontWeight: "bold", paddingHorizontal: 15, paddingVertical: 6, backgroundColor: COLOR.PRIMARY, borderRadius:20}}>Chờ xác nhận</Text>
            </View>
            <Divider/>
        </>}


        {doctor?.assignment?.status=="accepted"&&
        <>
            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', width: '100%',marginTop: 16,}}>
                <Text style={{color: COLOR.BLACK,fontSize: 16,textTransform: 'capitalize'}}>Trạng thái</Text>
                <Text style={{color: COLOR.WHITE, textAlign:"center", fontWeight: "bold", paddingHorizontal: 15, paddingVertical: 6, backgroundColor: COLOR.GREEN, borderRadius:20}}>Đã kết nối</Text>
            </View>
            <Divider/>
        </>}

        <FiledInfoUser label="Họ tên" value={doctor?.user?.fullname} />
        <Divider/>
        <FiledInfoUser label="Giới tính" value={doctor?.user?.gender==="male"?"Nam":doctor?.user?.gender==="female"?"Nữ":"Khác"}/>
        <Divider/>
        <FiledInfoUser label="Ngày sinh" value={doctor?.user?.dob?new Date(doctor?.user?.dob).toLocaleDateString():""}/>
        <Divider/>
        <FiledInfoUser label="Điện thoại" value={doctor?.user?.phone}/>
        <Divider/>
        <FiledInfoUser label="Địa chỉ" value={doctor?.user?.address}/>
        <Divider/>
        <FiledInfoUser label="Chuyên ngành" value={doctor?.specialty}/>
        <Divider/>
        <FiledInfoUser label="Số giấy phép" value={doctor?.licenseNumber}/>
        <Divider/>
        <FiledInfoUser label="Ngày cấp" value={doctor?.licenseIssueDate?new Date(doctor?.licenseIssueDate).toLocaleDateString():""}/>
        <Divider/>
        <FiledInfoUser label="Nơi làm việc" value={doctor?.hospital}/>
        <Divider/>
        <FiledInfoUser label="Kinh nghiệm" value={doctor?.yearsOfExp}/>
       
        <Divider />

        {(doctor?.assignment?.status=="pending"||doctor?.assignment?.status=="accepted")?
        <TouchableOpacity style={[styles.btnLogout, {backgroundColor:COLOR.RED}]} activeOpacity={0.8} onPress={cancelRequest}>
          <Text style={{color: COLOR.WHITE, textAlign:"center", fontWeight: "bold", padding: 10}}> Hủy kết nối </Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={[styles.btnLogout, {backgroundColor:COLOR.GREEN}]} activeOpacity={0.8} onPress={sendRequest}>
          <Text style={{color: COLOR.WHITE, textAlign:"center", fontWeight: "bold", padding: 10}}> Yêu cầu kết nối </Text>
        </TouchableOpacity>
        }

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  txt: {
    color: COLOR.BLACK,
    fontSize: 16,
  },
  btnLogout: {
    width: '100%',
    marginTop: 24,
    borderRadius: 40,
  },
});
