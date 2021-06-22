import firebase from 'firebase/app'
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyBw9NrG469B_W5F1pYcBbiZD5CvwVKG5IM",
    authDomain: "project-test-2-cad2c.firebaseapp.com",
    projectId: "project-test-2-cad2c",
    storageBucket: "project-test-2-cad2c.appspot.com",
    messagingSenderId: "863217189304",
    appId: "1:863217189304:web:d1e6a46e10dc15aebd8f4d",
    measurementId: "G-BZKLFGZETL"
});

export { firebaseConfig as firebase };