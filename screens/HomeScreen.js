import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BlobView from '../components/BlobView';
import PdfView from '../components/PdfView';

const Stack = createNativeStackNavigator();

const HomeScreen = ({userInfo, setLoggedIn}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BlobView">
        <Stack.Screen name="BlobView">
          {props => (
            <BlobView
              {...props}
              userInfo={userInfo}
              setLoggedIn={setLoggedIn}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="PdfView" component={PdfView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
