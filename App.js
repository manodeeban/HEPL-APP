import React, {useEffect, useRef, useState} from 'react';
import {AppState, StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInScreen from './screens/SignInScreen';
import BlobView from './components/BlobView';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const timerRef = useRef(null);

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
  useEffect(() => {
    getLocalUser();

    // Start listening to app state changes to reset timer on app foreground
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    // Start the timeout when loggedIn state changes
    if (loggedIn) {
      startTimer();
    } else {
      clearTimer();
    }
  }, [loggedIn]);

  const handleAppStateChange = nextAppState => {
    if (nextAppState === 'active' && loggedIn) {
      resetTimer();
    }
  };

  const startTimer = () => {
    timerRef.current = setTimeout(handleAutoSignOut, 60000); // 1 minute timeout
  };

  const resetTimer = () => {
    clearTimer();
    startTimer();
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

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
      {loggedIn ? (
        <HomeScreen userInfo={userInfo} setLoggedIn={setLoggedIn} />
      ) : (
        <SignInScreen signIN={signIN} />
      )}
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
