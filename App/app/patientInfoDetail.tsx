import Divider from '@/components/Divider';
import FiledInfoUser from '@/components/FiledInfoUser';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useAppContext } from '../container/AppProvider';
import { URL, COLOR } from '@/CONST';
import { useRoute } from '@react-navigation/native';

export default function Profile() {
    const { sharedData, setSharedData } = useAppContext();
    const [loading, setLoading] = useState<boolean>(true);

    const route = useRoute();
    const { _id }: any = route.params;

    const [data, setData] = useState<any>();

    useEffect(() => {
        if (_id !== undefined && sharedData !== null) {
            setLoading(true);
            fetch(URL + '/user/getPatientById/' + _id, {
                method: 'GET',
            })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoading(false);
                console.log('🚀 ~ file: patientInforDetail.tsx ~ data', data);
            });
        }
    }, [_id, sharedData]);

    const responseRequest = async (status: string) => {
        setLoading(true);
        const res = await fetch(URL + '/user/responseAssignment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: data?._id,
                status: status,
            }),
        })

        if (res.ok) Alert.alert('Thành công', 'Yêu cầu đã được gửi');
        else {
            try {
                const data = await res.json();
                Alert.alert('Error', data.message);
            }
            catch (e) {
                Alert.alert('Error', 'Something went wrong');
            }
        }
        setLoading(false);
        router.replace('/(doctor_tabs)');
    };

    if (loading) return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLOR.PRIMARY} />
          <Text style={{color: COLOR.PRIMARY, textAlign: 'center',fontSize: 20, fontWeight: 'bold', marginTop: 20,}}> Loading... </Text>
        </View>
    );

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image source={{uri: data?.patient?.user?.image?data?.patient?.user?.image:'https://cdn.glitch.global/ee29f481-23c3-4bdb-a029-c84ebe6fdfef/avatar.png?v=1732878991705',}}style={{width: 130,height: 130,marginBottom: 20,borderRadius: 180,backgroundColor: COLOR.PRIMARY}} />

                {data?.status == "pending" &&
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 16, }}>
                            <Text style={{ color: COLOR.BLACK, fontSize: 16, textTransform: 'capitalize' }}>Trạng thái</Text>
                            <Text style={{ color: COLOR.WHITE, textAlign: "center", fontWeight: "bold", paddingHorizontal: 15, paddingVertical: 6, backgroundColor: COLOR.PRIMARY, borderRadius: 20 }}>Chờ xác nhận</Text>
                        </View>
                        <Divider />
                    </>}

                {data?.status == "accepted" &&
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 16, }}>
                            <Text style={{ color: COLOR.BLACK, fontSize: 16, textTransform: 'capitalize' }}>Trạng thái</Text>
                            <Text style={{ color: COLOR.WHITE, textAlign: "center", fontWeight: "bold", paddingHorizontal: 15, paddingVertical: 6, backgroundColor: COLOR.GREEN, borderRadius: 20 }}>Đã kết nối</Text>
                        </View>
                        <Divider />
                    </>}

                <FiledInfoUser label="Họ tên" value={data?.patient?.user?.fullname} />
                <Divider />
                <FiledInfoUser label="Giới tính" value={data?.patient?.user?.gender === "male" ? "Nam" : data?.patient?.user?.gender === "female" ? "Nữ" : "Khác"} />
                <Divider />
                <FiledInfoUser label="Ngày sinh" value={data?.patient?.user?.dob?new Date(data?.patient?.user?.dob).toLocaleDateString():""} />
                <Divider />
                <FiledInfoUser label="Điện thoại" value={data?.patient?.user?.phone} />
                <Divider />
                <FiledInfoUser label="Địa chỉ" value={data?.patient?.user?.address} />
                <Divider />
                <FiledInfoUser label="Chiều cao" value={data?.patient?.height} />
                <Divider />
                <FiledInfoUser label="Cân nặng" value={data?.patient?.weight} />
                <Divider />
                <FiledInfoUser label="Nhóm máu" value={data?.patient?.bloodType} />
                <Divider />
                <FiledInfoUser label="Dị ứng" value={data?.patient?.allergies} />
                <Divider />
                <FiledInfoUser label="Thuốc đang dùng" value={data?.patient?.medications} />

                <Divider />
                
                {data?.status == "pending" && 
                    <View style={{ flexDirection: 'row', gap: 20, width: '100%' }}>
                        <TouchableOpacity style={{ flex: 1, marginTop: 24, backgroundColor: COLOR.GREEN, borderRadius: 20 }} onPress={() => responseRequest("accepted")}>
                            <Text style={{ color: COLOR.WHITE, textAlign: "center", fontWeight: "bold", padding: 10 }}> Chấp nhận </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flex: 1, marginTop: 24, backgroundColor: COLOR.BLUE, borderRadius: 20 }} onPress={() => responseRequest("rejected")}>
                            <Text style={{ color: COLOR.WHITE, textAlign: "center", fontWeight: "bold", padding: 10 }}> Từ chối </Text>
                        </TouchableOpacity>
                    </View>
                }

                {data?.status == "accepted" && 
                    <TouchableOpacity style={{ flex: 1, marginTop: 24, backgroundColor: COLOR.RED, borderRadius: 20 }} onPress={() => responseRequest("disconnected")}>
                        <Text style={{ color: COLOR.WHITE, textAlign: "center", fontWeight: "bold", padding: 10 }}> Hủy kết nối </Text>
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
});
