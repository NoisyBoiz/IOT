import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, TextInput, Alert , ActivityIndicator} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { useAppContext } from '../container/AppProvider';
import { URL, COLOR } from '@/CONST';
import { router } from 'expo-router';

interface Patient {
    _id: string;
    dob: Date;
    gender: string;
    phone: string;
    address: string;
    height: number;
    weight: number;
    bloodType: string;
    allergies: string;
    medications: string;
}

interface Doctor {
    _id: string;
    dob: Date;
    gender: string;
    phone: string;
    address: string;
    specialty: string;
    licenseNumber: string;
    licenseIssueDate: Date;
    hospital: string;
    yearsOfExp: number;
}

const safeParseDate = (date: any): Date => (date ? new Date(date) : new Date());

export default function EditProfile() {
    const { sharedData, setSharedData } = useAppContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<Patient | Doctor | null>(null);
    const [showDob, setShowDob] = useState<boolean>(false);

    const onChange = (field: keyof (Patient & Doctor), value: any) => {
        if (profile) {
            setProfile(prev => ({ ...prev!, [field]: value }));
        }
    };

    useEffect(() => {
        if (!sharedData) return;

        const isPatient = sharedData?.user?.role === 'patient';
        if (isPatient) {
            setProfile({
                _id: sharedData._id || '',
                dob: safeParseDate(sharedData.user.dob),
                gender: sharedData.user.gender || '',
                phone: sharedData.user.phone || '',
                address: sharedData.user.address || '',
                height: sharedData.height || 0,
                weight: sharedData.weight || 0,
                bloodType: sharedData.bloodType || '',
                allergies: sharedData.allergies || '',
                medications: sharedData.medications || '',
            } as Patient);
        } else {
            setProfile({
                _id: sharedData._id || '',
                dob: safeParseDate(sharedData.user.dob),
                gender: sharedData.user.gender || '',
                phone: sharedData.user.phone || '',
                address: sharedData.user.address || '',
                specialty: sharedData.specialty || '',
                licenseNumber: sharedData.licenseNumber || '',
                licenseIssueDate: safeParseDate(sharedData.licenseIssueDate),
                hospital: sharedData.hospital || '',
                yearsOfExp: sharedData.yearsOfExp || 0,
            } as Doctor);
        }
    }, [sharedData]);

    const handleEditProfile = () => {
        if (!profile) {
            Alert.alert('Lỗi', 'Dữ liệu không hợp lệ!');
            return;
        }
        setLoading(true);
        fetch(`${URL}/user/updateProfile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        })
        .then(response => response.json())
        .then(data => {
            setSharedData(data.info);
            Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        })
        .catch(error => {
            Alert.alert('Lỗi', error.toString());
        });
        setLoading(false);
        if(sharedData?.user?.role === 'doctor') router.replace('/(doctor_tabs)/profile');
        if(sharedData?.user?.role === 'patient') router.replace('/(patient_tabs)/profile');
    };

    if (loading) return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLOR.PRIMARY} />
          <Text style={{color: COLOR.PRIMARY, textAlign: 'center',fontSize: 20, fontWeight: 'bold', marginTop: 20,}}> Loading... </Text>
        </View>
    );
    


    return (
        <ScrollView style={{backgroundColor: COLOR.BACKGROUND}}>
            <View style={styles.container}>
                <Text style={styles.label}>Giới tính</Text>
                <RNPickerSelect
                    style={{ inputIOS: styles.picker, inputAndroid: styles.picker }}
                    onValueChange={value => onChange('gender', value)}
                    items={[
                        { label: 'Nam', value: 'male' },
                        { label: 'Nữ', value: 'female' },
                        { label: 'Khác', value: 'other' },
                    ]}
                    value={profile?.gender}
                />

                <Text style={styles.label}>Ngày sinh</Text>
                <TouchableOpacity onPress={() => setShowDob(true)} style={styles.dateButton}>
                    <Text style={styles.dateText}>
                        {profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Ngày sinh'}
                    </Text>
                </TouchableOpacity>
                {showDob && (
                    <DateTimePicker
                        value={safeParseDate(profile?.dob)}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            if (event.type === 'set' && selectedDate) {
                                onChange('dob', selectedDate);
                            }
                            setShowDob(false);
                        }}
                    />
                )}

                <Text style={styles.label}>Điện thoại</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Điện thoại"
                    value={profile?.phone || ''}
                    onChangeText={value => onChange('phone', value)}
                />

                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ"
                    value={profile?.address || ''}
                    onChangeText={value => onChange('address', value)}
                />

                {sharedData?.user?.role === 'patient' && <PatientForm profile={profile as Patient} onChange={onChange} />}
                {sharedData?.user?.role === 'doctor' && <DoctorForm profile={profile as Doctor} onChange={onChange} />}

                <TouchableOpacity style={styles.saveButton} onPress={handleEditProfile}>
                    <Text style={styles.saveText}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const PatientForm = ({ profile, onChange }: { profile: Patient; onChange: Function }) => (
    <>
        <Text style={styles.label}>Chiều cao</Text>
        <TextInput
            style={styles.input}
            placeholder="Chiều cao"
            value={profile?.height.toString()}
            onChangeText={value => onChange('height', parseInt(value, 10))}
        />

        <Text style={styles.label}>Cân nặng</Text>
        <TextInput
            style={styles.input}
            placeholder="Cân nặng"
            value={profile?.weight.toString()}
            onChangeText={value => onChange('weight', parseInt(value, 10))}
        />

        <Text style={styles.label}>Nhóm máu</Text>
        <RNPickerSelect
            style={{ inputIOS: styles.picker, inputAndroid: styles.picker }}
            onValueChange={value => onChange('bloodType', value)}
            items={[
                { label: 'A+', value: 'A+' },
                { label: 'A-', value: 'A-' },
                { label: 'B+', value: 'B+' },
                { label: 'B-', value: 'B-' },
                { label: 'AB+', value: 'AB+' },
                { label: 'AB-', value: 'AB-' },
                { label: 'O+', value: 'O+' },
                { label: 'O-', value: 'O-' },
            ]}
            value={profile?.bloodType}
        />

        <Text style={styles.label}>Dị ứng</Text>
        <TextInput
            style={styles.input}
            placeholder="Dị ứng"
            value={profile?.allergies || ''}
            onChangeText={value => onChange('allergies', value)}
        />

        <Text style={styles.label}>Thuốc đang dùng</Text>
        <TextInput
            style={styles.input}
            placeholder="Thuốc đang dùng"
            value={profile?.medications || ''}
            onChangeText={value => onChange('medications', value)}
        />
    </>
);

const DoctorForm = ({ profile, onChange }: { profile: Doctor; onChange: Function }) => {
    const [showLicenseDate, setShowLicenseDate] = useState<boolean>(false);

    return (
        <>
            <Text style={styles.label}>Chuyên ngành</Text>
            <TextInput
                style={styles.input}
                placeholder="Chuyên ngành"
                value={profile?.specialty || ''}
                onChangeText={value => onChange('specialty', value)}
            />

            <Text style={styles.label}>Số giấy phép</Text>
            <TextInput
                style={styles.input}
                placeholder="Số giấy phép"
                value={profile?.licenseNumber || ''}
                onChangeText={value => onChange('licenseNumber', value)}
            />

            <Text style={styles.label}>Ngày cấp</Text>
            <TouchableOpacity onPress={() => setShowLicenseDate(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>
                    {profile?.licenseIssueDate
                        ? new Date(profile.licenseIssueDate).toLocaleDateString()
                        : 'Ngày cấp'}
                </Text>
            </TouchableOpacity>
            {showLicenseDate && (
                <DateTimePicker
                    value={safeParseDate(profile?.licenseIssueDate)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        if (event.type === 'set' && selectedDate) {
                            onChange('licenseIssueDate', selectedDate);
                        }
                        setShowLicenseDate(false);
                    }}
                />
            )}

            <Text style={styles.label}>Bệnh viện</Text>
            <TextInput
                style={styles.input}
                placeholder="Bệnh viện"
                value={profile?.hospital || ''}
                onChangeText={value => onChange('hospital', value)}
            />

            <Text style={styles.label}>Kinh nghiệm (năm)</Text>
            <TextInput
                style={styles.input}
                placeholder="Số năm kinh nghiệm"
                value={profile?.yearsOfExp.toString()}
                onChangeText={value => onChange('yearsOfExp', parseInt(value, 10))}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        color: COLOR.BLACK,
    },
    input: {
        width: '100%',
        height: 50,
        outlineColor: COLOR.PRIMARY,
        borderWidth: 0,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: COLOR.LIGHT_GRAY 
    },
    picker: { fontSize: 16, paddingHorizontal: 10, marginBottom: 10, backgroundColor: COLOR.LIGHT_GRAY },
    dateButton: {
        // borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        backgroundColor: COLOR.LIGHT_GRAY
    },
    dateText: { fontSize: 16 },
    saveButton: {
        backgroundColor: COLOR.PRIMARY,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
