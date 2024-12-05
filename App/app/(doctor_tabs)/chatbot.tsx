import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, Fragment } from 'react';
import { ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';
import { useAppContext } from '../../container/AppProvider';
import { URL, COLOR, AVATAR_DEFAULT } from '@/CONST';
import { Image } from 'react-native';

export default function ChatBot() {
  const { sharedData, setSharedData } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (sharedData === null) return;
    setLoading(true);
    fetch(URL + '/chat/' + sharedData._id, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.chat);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [sharedData]);

  const ask = async () => {
    try {
      if (message.trim() === '' || loading) return;
      setLoading(true);

      let bodyData = JSON.stringify({
        message: message,
        userId: sharedData._id,
      });
      setMessage('');

      const res = await fetch(URL + '/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setData((prevData) => prevData.concat(data.data));
        setLoading(false);
      }
    } catch (e) {
      console.error('Error in sending message: ', e);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 8, paddingVertical: 15 }}>
        <View>
          {data.length&&data.map((item: any, index) => (
              <Fragment key={index}>
                {/* User Message */}
                <View style={{ display: 'flex',flexDirection: 'row',justifyContent: 'flex-end',width: '100%',marginBottom: 8, gap: 5}}>
                  <Text style={[styles.txt, { backgroundColor: COLOR.PRIMARY, color: COLOR.WHITE }]}>
                    {item.message}
                  </Text>
                  <Image
                    source={{ uri: sharedData?.user?.image ? sharedData?.user?.image : AVATAR_DEFAULT}}
                    style={[styles.image, { backgroundColor: COLOR.LIGHT_GRAY }]}
                  />
                </View>

   
                <View style={{display: 'flex',justifyContent: 'flex-end', width: '100%', marginBottom: 8, gap: 5, flexDirection: 'row-reverse',}} >
                  <Text style={[styles.txt, { backgroundColor: COLOR.LIGHT_GRAY, color: COLOR.BLACK }]}>
                    {item.response}
                  </Text>
                  <Image
                    source={{ uri: 'https://cdn.glitch.global/ee29f481-23c3-4bdb-a029-c84ebe6fdfef/chatbot.png?v=1732878791046',}}
                    style={[styles.image, { backgroundColor: COLOR.PRIMARY }]}
                  />
                </View>
              </Fragment>
            ))}
        </View>
      </ScrollView>

      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder="Enter..."
          placeholderTextColor={COLOR.LIGHT_GRAY}
          value={message}
          onChangeText={setMessage}
        />
        <Ionicons size={24} style={styles.icon} name="paper-plane" onPress={ask} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  containerInput: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    width: '90%',
    outlineColor: COLOR.PRIMARY,
    borderWidth: 0,
    borderRadius: 40,
    backgroundColor: COLOR.PRIMARY,
    padding: 10,
    color: COLOR.WHITE,
  },
  icon: {
    padding: 10,
    color: COLOR.PRIMARY,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  txt: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 10,
    maxWidth: '80%',
  },
});
