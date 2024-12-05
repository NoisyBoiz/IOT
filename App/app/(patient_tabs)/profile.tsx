import Divider from '@/components/Divider';
import FiledInfoUser from '@/components/FiledInfoUser';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../container/AppProvider';
import { COLOR } from '@/CONST';

export default function Profile(){
  const {sharedData, setSharedData} = useAppContext();
  const onLogout = () => {
    setSharedData(null);
    router.replace('/(auth)');
  };

  const onEdit = () => {  
    router.navigate('/editProfile');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{uri: sharedData?.user?.image?sharedData?.user?.image:'https://cdn.glitch.global/ee29f481-23c3-4bdb-a029-c84ebe6fdfef/avatar.png?v=1732878991705',}}style={{width: 130,height: 130,marginBottom: 20,borderRadius: 180,backgroundColor: COLOR.PRIMARY}} />

        <FiledInfoUser label="Họ tên" value={sharedData?.user?.fullname} />
        <Divider/>
        <FiledInfoUser label="Giới tính" value={sharedData?.user?.gender==="male"?"Nam":sharedData?.user?.gender==="female"?"Nữ":"Khác"}/>
        <Divider/>
        <FiledInfoUser label="Ngày sinh" value={sharedData?.user?.dob?new Date(sharedData?.user?.dob).toLocaleDateString():""}/>
        <Divider/>
        <FiledInfoUser label="Điện thoại" value={sharedData?.user?.phone}/>
        <Divider/>
        <FiledInfoUser label="Địa chỉ" value={sharedData?.user?.address}/>
    
        <Divider/>
        <FiledInfoUser label="Chiều cao" value={sharedData?.height}/>
        <Divider/>
        <FiledInfoUser label="Cân nặng" value={sharedData?.weight}/>
        <Divider/>
        <FiledInfoUser label="Nhóm máu" value={sharedData?.bloodType}/>
        <Divider/>
        <FiledInfoUser label="Dị ứng" value={sharedData?.allergies}/>
        <Divider/>
        <FiledInfoUser label="Thuốc đang dùng" value={sharedData?.medications}/>
      
        <Divider />
        <TouchableOpacity style={styles.btnLogout} activeOpacity={0.8} onPress={onEdit}>
          <Text style={{color: COLOR.WHITE, textAlign:"center", fontWeight: "bold", padding: 10}}>Sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLogout} activeOpacity={0.8} onPress={onLogout}>
          <Text style={{color: COLOR.WHITE, textAlign:"center", fontWeight: "bold", padding: 10}}>Đăng xuất</Text>
        </TouchableOpacity>
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
    backgroundColor: COLOR.PRIMARY,
    width: '100%',
    marginTop: 24,
    borderRadius: 40,
  },
});
