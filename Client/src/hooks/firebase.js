import firebase from 'firebase/app'
import "firebase/firestore";

// custom firebase hook

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyBIuy2AyZ1BbeWsIdXBWPVHbZOOLUKlo4g",
    authDomain: "pin-mi-e430d.firebaseapp.com",
    projectId: "pin-mi-e430d",
    storageBucket: "pin-mi-e430d.appspot.com",
    messagingSenderId: "31998012275",
    appId: "1:31998012275:web:fc8cd7078523c457c63306",
    measurementId: "G-CBF7TZ5DF5"
});

export { firebaseConfig as firebase };