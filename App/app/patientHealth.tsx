import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import Charts from '@/components/Charts';
import { useAppContext } from '../container/AppProvider';
import { useIsFocused } from '@react-navigation/native';
import { URL, COLOR } from '@/CONST';
import DateTimePicker from '@react-native-community/datetimepicker';
import io, { Socket } from 'socket.io-client';
import { useRoute } from '@react-navigation/native';

export default function Doctor() {
  const { sharedData } = useAppContext();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  const route = useRoute();
  const { _id }: any = route.params;

  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const [labels, setLabels] = useState<string[]>([]);
  const [heartRate, setHeartRate] = useState<number[]>([]);
  const [spo2, setSpo2] = useState<number[]>([]);

  const [message, setMessage] = useState<any>('');

  // Handle socket connection and fetching health data
  useEffect(() => {
    if (sharedData === null || !isFocused) return;

    const socketInstance: Socket = io(URL);
    socketInstance.on('connection', () => {
      socketInstance.emit('listen', _id);
    });

    socketInstance.on('healths', (data: any) => {
      if (data?.heartRate && data?.spo2) {
        setMessage(data);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [sharedData, isFocused]);

  // Handle incoming health data and update chart data
  useEffect(() => {
    if (message?.heartRate && message?.spo2) {
      let nDate = new Date(date);
      let startDate = `${nDate.getFullYear()}-${nDate.getMonth()}-${nDate.getDate()}`;
      let now = new Date();
      let startNow = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

      if (startDate === startNow) {
        setLabels((prev) => [...prev, '']);
        setHeartRate((prev) => [...prev, message.heartRate]);
        setSpo2((prev) => [...prev, message.spo2]);
      }
    }
  }, [message]);

  // Fetch health data for the selected date
  useEffect(() => {
    if (isFocused && _id !== null) {
      setLoading(true);
      fetch(`${URL}/health/${_id}/${date.toISOString()}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.health) {
            const lb: string[] = [];
            const hr: number[] = [];
            const sp: number[] = [];
            data.health.forEach((item: any) => {
              lb.push('');
              hr.push(item.heartrate);
              sp.push(item.spo2);
            });
            setLabels(lb);
            setHeartRate(hr);
            setSpo2(sp);
          }
        })
        .catch((error) => {
          console.error('Error fetching health data:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [date, sharedData, isFocused]);

  // Handle DateTimePicker visibility
  const datePicker = useMemo(() => {
    return show && (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          if (selectedDate) {
            setShow(false);
            setDate(new Date(selectedDate));
          }
        }}
      />
    );
  }, [date, show]);

  // Loading screen
  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      <Text style={{color: COLOR.PRIMARY, textAlign: 'center',fontSize: 20, fontWeight: 'bold', marginTop: 20,}}> Loading... </Text>
    </View>
);

  return (
    <View style={styles.container}>
      {/* Date Picker Button */}
      <TouchableOpacity onPress={() => setShow(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {datePicker}

      {/* Display Charts or No Data Message */}
      {labels.length ? (
        <>
          <Charts title="Heart Rate" labels={labels} data={heartRate} />
          <Charts title="Spo2" labels={labels} data={spo2} />
        </>
      ) : (
        <Text style={styles.txt}>Không có dữ liệu</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  txt: {
    color: COLOR.PRIMARY,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  dateButton: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 20,
    marginBottom: 20,
  },
  dateButtonText: {
    color: COLOR.WHITE,
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
});
