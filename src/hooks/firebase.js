import firebase from 'firebase/app'
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyAgrCEFA0mP0VHZApA774OWYF-ydZka6aY",
    authDomain: "fbtest-fd449.firebaseapp.com",
    databaseURL: "https://fbtest-fd449-default-rtdb.firebaseio.com",
    projectId: "fbtest-fd449",
    storageBucket: "fbtest-fd449.appspot.com",
    messagingSenderId: "1030894182264",
    appId: "1:1030894182264:web:da9a1dda8ef31ac3be328d",
    measurementId: "G-CXQ9YE9HPS"
});

export { firebaseConfig as firebase };