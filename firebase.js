// App.js
import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDgwTM4IYOd_TVDNHxeP7vfAu2S9XWAuF0",
    authDomain: "hepl-task.firebaseapp.com",
    projectId: "hepl-task",
    storageBucket: "hepl-task.appspot.com",
    messagingSenderId: "1043067605789",
    appId: "1:1043067605789:web:3bea51a54a56fa76bac7f4",
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

