import React, {useRef, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import {pdfUrlToBase64} from '../utils/PdfHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Icon} from '@rneui/base';

const BlobView = ({userInfo, setLoggedIn}) => {
  const [pdfurl, setPdfUrl] = useState('');
  const [base64Data, setBase64Data] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const animationRef = useRef(null);
  const navigation = useNavigation();

  if (pdfurl) {
    pdfUrlToBase64(pdfurl)
      .then(base64 => {
        setBase64Data(String(base64));
      })
      .catch(error => {
        console.error('Error converting PDF to Base64:', error);
      });
  }

  const handleViewPdf = async () => {
    if (!pdfurl) {
      Alert.alert('Error', 'Please enter PDF Url');
      return;
    }

    try {
      const blob = await RNFetchBlob.polyfill.Blob.build(base64Data, {
        type: 'application/pdf' + ';BASE64',
      });
      const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/temp.pdf`;
      await RNFetchBlob.fs.cp(blob._ref, filePath);
      setAnimationSpeed(30.0);
      animationRef.current.play();
      setTimeout(() => {
        setAnimationSpeed(1.0);
        navigation.navigate('PdfView', {localPdf: filePath});
        setPdfUrl('');
      }, 1000);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load PDF');
    }
  };

  const handleReset = () => {
    setPdfUrl('');
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      await AsyncStorage.removeItem('@user');
      setLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.usercard}>
        <Image
          style={styles.profileImage}
          source={{uri: userInfo?.additionalUserInfo?.profile?.picture}}
        />
        <Text style={{color: 'black'}}>
          Welcome {userInfo?.additionalUserInfo?.profile?.given_name}
        </Text>
        <TouchableOpacity
          style={styles.logout}
          onPress={() => setModalVisible(true)}>
          <Icon
            name="logout"
            type="simplelineicons"
            color={'black'}
            size={20}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.aniContainer}>
        <LottieView
          ref={animationRef}
          source={require('../assets/PDF-animation.json')}
          autoPlay
          progress={1.0}
          speed={animationSpeed}
          style={styles.animation}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter PDF Url"
        placeholderTextColor="#888888"
        value={pdfurl}
        onChangeText={setPdfUrl}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleViewPdf}>
          <Text style={styles.buttonText}>View PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Sign Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.buttonContainerlg}>
              <TouchableOpacity
                style={styles.buttonlg}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonTextlg}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.signOutButton]}
                onPress={signOut}>
                <Text style={styles.buttonTextlg}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usercard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 30,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  animation: {
    width: 300,
    height: 600,
  },
  aniContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  buttonContainerlg: {
    flexDirection: 'row',
  },
  buttonlg: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  signOutButton: {
    backgroundColor: 'red',
  },
  buttonTextlg: {
    color: 'white',
    fontWeight: 'bold',
  },
  logout: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});

export default BlobView;
