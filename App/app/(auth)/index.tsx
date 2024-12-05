import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { URL, COLOR } from '@/CONST';
import { useAppContext } from '@/container/AppProvider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setSharedData } = useAppContext();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if(res.status === 200) {
        const data = await res.json();
        console.log('🚀 ~ handleLogin ~ data', data);
        setSharedData(data.info);
        if(data.info.user.role === 'doctor') router.replace('/(doctor_tabs)');
        if(data.info.user.role === 'patient') router.replace('/(patient_tabs)');
      }
      else {
        try{
          const data = await res.json();
          Alert.alert('Error', data.message);
        }
        catch(e){
          Alert.alert('Error', 'Something went wrong');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = () => {
    router.navigate('/register');
  };

  return (
    <View style={styles.container}>

    <View style={styles.top}>
      <Text style={styles.logo}>
        <Text style={{"color": COLOR.WHITE}}>Life</Text>
        <Text style={{"color": COLOR.BLACK}}>Node</Text>
      </Text>
    </View>

    <View style={styles.content}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>
        Username
      </Text>
      <TextInput
        style={styles.input}
        placeholder="someone@gmail.com"
        placeholderTextColor="#b0b0b0"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.label}>
        Password
      </Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#b0b0b0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
        <Text style={styles.btnLoginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
        <Text style={styles.btnRegisterText}> Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.PRIMARY,
  },
  top: {
    flex: 1.5,
    flexShrink: 1,
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
  btnLogin: {
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  btnLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnRegister: {
    marginTop: 10,
  },
  btnRegisterText: {
    color: COLOR.BLACK,
    textAlign: 'center',
  },
});

