import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './resources/globalStyles'
import NextToGoRenderer from './components/nextToGoRenderer'

export default function App() {
  return (
    <View style={styles.screen}>
      <View style = {styles.appHeader}>
        <Text style={styles.textHeader}>Next to Go!</Text>
      </View>
      <View style = {styles.appBody}>
        <NextToGoRenderer/>
      </View>
      <View style = {styles.appFooter}>
        <Text style = {styles.textFooter}>Technical Challenge - Rhys Jones</Text>
      </View>
    </View>
  );
}
