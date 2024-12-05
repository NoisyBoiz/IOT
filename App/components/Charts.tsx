import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLOR } from '@/CONST';

interface ICharts {
  title: string,
  labels: string[],
  data: number[],
}

const Charts: React.FC<ICharts> = ({title, labels, data}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}> {title} </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{data: data}],
        }}
        width={Dimensions.get('window').width - 32} // from react-native
        height={220}
        // yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default Charts;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    color: COLOR.BLACK,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
