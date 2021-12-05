import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './resources/globalStyles';
import NextToGoRenderer from './components/nextToGoRenderer';
import { createStore } from 'redux';
import rootReducer from './store/reducers';
import { Provider } from 'react-redux'

const store = createStore(rootReducer)

export default function App() {
  return (
    <View style={styles.screen}>
      <View style = {styles.appHeader}>
        <Text style={styles.textHeader}>Next to Go!</Text>
      </View>
      <View style = {styles.appBody}>
        <Provider store = {store}>
          <NextToGoRenderer/>
        </Provider>
      </View>
      <View style = {styles.appFooter}>
        <Text style = {styles.textFooter}>Technical Challenge - Rhys Jones</Text>
      </View>
    </View>
  );
}
