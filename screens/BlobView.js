import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  Button,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import {pdfUrlToBase64} from '../utils/PdfHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const BlobView = ({userInfo, setLoggedIn}) => {
  const [pdfurl, setPdfUrl] = useState('');
  const [base64Data, setBase64Data] = useState('');
  const [viewPdf, setViewPdf] = useState(false);
  const [localPdf, setLocalPdf] = useState('');

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
      Alert.alert('Error', 'Please enter a base64 encoded PDF string');
      return;
    }

    try {
      // Convert base64 to blob and save it to a file
      const pdfBlob = RNFetchBlob.base64.decode(base64Data);
      const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/temp.pdf`;
      await RNFetchBlob.fs.writeFile(filePath, base64Data, 'base64');
      setLocalPdf(filePath);
      setViewPdf(true);
      setPdfUrl('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load PDF');
    }
  };

  const handleReset = () => {
    setPdfUrl('');
    setLocalPdf('');
    setViewPdf(false);
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
        <Button title="Sign Out" onPress={signOut} />
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

      {viewPdf && localPdf ? (
        <Pdf
          source={{uri: `file://${localPdf}`}}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  pdf: {
    flex: 1,
    marginTop: 20,
  },
  usercard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 10,
    borderColor: '#dddddd',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: 350,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default BlobView;
