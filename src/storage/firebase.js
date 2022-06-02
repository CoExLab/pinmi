import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// custom firebase hook

const firebaseConfig = firebase.initializeApp({
  apiKey: 'AIzaSyBOFPxsSfAZ7kgB-Z8GgPAFBnr8EyvyJyg',
  authDomain: 'pinmi-59c77.firebaseapp.com',
  projectId: 'pinmi-59c77',
  storageBucket: 'pinmi-59c77.appspot.com',
  messagingSenderId: '839028920590',
  appId: '1:839028920590:web:a16ad3b6056ba7dd1b075f',
  measurementId: 'G-GHJVP7CDF7',
});

export { firebaseConfig as firebase };
