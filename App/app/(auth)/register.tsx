import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { URL, COLOR } from '@/CONST';

interface UserInfo {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function Register(){
  const [infoUser, setInfoUser] = useState<UserInfo>({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });

  const router = useRouter();

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setInfoUser({ ...infoUser, [field]: value });
  };

  const handleRegister = async () => {
    const {fullname, username, password, confirmPassword, role} = infoUser;

    if (!fullname || !username || !password || !confirmPassword || !role) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      const res = await fetch(`${URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullname,
          username: username,
          password: password,
          role: role,
        }),
      });

      if (!res.ok) {
        let errorData = null;
        try {
          errorData = await res.json();
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error(`Error ${res.status}: Invalid JSON response`);
        }
        console.error('Error response from server:', errorData);
        throw new Error(`Error ${res.status}: ${errorData.message || 'Sign-in failed'}`);
      }

      const data = await res.json();
      Alert.alert('Đăng ký thành công', 'Bạn đã đăng ký tài khoản thành công!', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      console.log('Success:', data);

      router.replace('..');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = () => {
    router.navigate('/');
  }

  return (
    <View style={styles.container}>

    <View style={styles.top}>
      <Text style={styles.logo}>
        <Text style={{"color": COLOR.WHITE}}>Life</Text>
        <Text style={{"color": COLOR.BLACK}}>Node</Text>
      </Text>
    </View>

    <View style={styles.content}>
      <Text style={styles.title}>Register</Text>

      <View style={{flexDirection: 'row', marginBottom: 20, borderRadius: 20, overflow: 'hidden'}}>
        <TouchableOpacity style={{width:'50%', padding: 10, backgroundColor:infoUser?.role=="patient"?COLOR.PRIMARY:COLOR.LIGHT_GRAY}} onPress={() => handleInputChange('role', 'patient')}>
          <Text style={{fontSize: 15, fontWeight: 'bold', textAlign:'center', color: infoUser?.role=="patient"?COLOR.WHITE:COLOR.PRIMARY}}> Patient </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width:'50%', padding: 10, backgroundColor:infoUser?.role=="doctor"?COLOR.PRIMARY:COLOR.LIGHT_GRAY}} onPress={() => handleInputChange('role', 'doctor')}>
          <Text style={{fontSize: 15, fontWeight: 'bold', textAlign:'center', color: infoUser?.role=="doctor"?COLOR.WHITE:COLOR.PRIMARY}}> Doctor </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        Fullname
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Some One"
        placeholderTextColor="#b0b0b0"
        value={infoUser?.fullname}
        onChangeText={text => handleInputChange('fullname', text)}
        autoCapitalize="none"
      />

      <Text style={styles.label}>
        Username
      </Text>
      <TextInput
        style={styles.input}
        placeholder="someone@gmail.com"
        placeholderTextColor="#b0b0b0"
        value={infoUser?.username}
        onChangeText={text => handleInputChange('username', text)}
        autoCapitalize="none"
      />

      <Text style={styles.label}>
        Password
      </Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#b0b0b0"
        value={infoUser?.password}
        onChangeText={text => handleInputChange('password', text)}
        secureTextEntry
      />

      <Text style={styles.label}>
        Confirm Password
      </Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#b0b0b0"
        value={infoUser?.confirmPassword}
        onChangeText={text => handleInputChange('confirmPassword', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
        <Text style={styles.btnRegisterText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
        <Text style={styles.btnLoginText}> Already a user? Login </Text>
      </TouchableOpacity>

    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.PRIMARY,
  },
  top: {
    flex: 1.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 10,
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    marginTop: 20, // Add some space from the top
  },
  content: {
    flex: 8.5,
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    backgroundColor: COLOR.BACKGROUND,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: COLOR.PRIMARY,
  },
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
    backgroundColor: '#f6f6f6',
  },
  btnRegister: {
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },

  btnRegisterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  btnLogin: {
    marginTop: 10,
  },

  btnLoginText: {
    color: COLOR.BLACK,
    textAlign: 'center',
  },
});

