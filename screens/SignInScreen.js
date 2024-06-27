import LottieView from 'lottie-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';

const SignInScreen = ({signIN}) => {
  return (
    <View style={styles.container}>
      <Image
        style={{width: 200, height: 200, resizeMode: 'contain'}}
        source={require('../assets/LOGO-HEPL.webp')}
      />
      <LottieView
        source={require('../assets/Animation - 1719387193725.json')}
        autoPlay
        style={styles.animation}
      />

      <TouchableOpacity style={styles.button} onPress={signIN}>
        <Image
          style={{width: 30, height: 30, resizeMode: 'contain'}}
          source={require('../assets/google.png')}
        />
        <Text style={{textAlign: 'center', color: 'black', fontSize: 16}}>
          SignIn With Google
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    marginTop: 150,
    borderColor: '#dddddd',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: 350,
  },
  animation: {
    width: 400,
    height: 300,
  },
});
