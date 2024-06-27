import React, {useEffect, useState} from 'react';
import { StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import UserInactivity from 'react-native-user-inactivity';

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) {
      handleAutoSignOut();
    }
  }, [isActive]);

  GoogleSignin.configure({
    webClientId: process.env.WEBCLIENT_ID,
  });

  const signIN = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth()
        .signInWithCredential(googleCredential)
        .then(user => {
          setUserInfo(user);
          setLoggedIn(true);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const getLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('@user');
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
      if (userData) {
        setLoggedIn(true); // Update loggedIn state if user data exists locally
      }
    } catch (e) {
      console.log(e, 'Error getting local user');
    }
  };
  useEffect(() => {
    getLocalUser();
    const unsub = async () => {
      if (userInfo) {
        await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
        setUserInfo(userInfo);
      } else {
        console.log('user not authenticated');
      }
    };

    return () => unsub();
  }, []);

  const handleAutoSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      await AsyncStorage.removeItem('@user');
      setLoggedIn(false); // Update loggedIn state upon auto sign-out
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <UserInactivity
        timeForInactivity={60000}
        onAction={isActive => {
          setIsActive(isActive);
        }}
        style={{flex: 1}}>
        {loggedIn ? (
          <HomeScreen userInfo={userInfo} setLoggedIn={setLoggedIn} />
        ) : (
          <SignInScreen signIN={signIN} />
        )}
      </UserInactivity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: 'black',
  },
});
