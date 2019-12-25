import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDetTeQoHgzkHJWl2I0QK5DxPJbUGNecg0",
  authDomain: "loopinbox-9d938.firebaseapp.com",
  databaseURL: "https://loopinbox-9d938.firebaseio.com",
  projectId: "loopinbox-9d938",
  storageBucket: "loopinbox-9d938.appspot.com",
  messagingSenderId: "337727103571",
  appId: "1:337727103571:web:f91aa206d47916a62a9ca6",
  measurementId: "G-6YJ40TVVRY"
};

// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

export default firebase;
