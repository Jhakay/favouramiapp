import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { collection, getDocs } from 'firebase/firestore';


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQe0K5iXO0XQvuOJZIPSWLyWjUquOskCs",
  authDomain: "favourami-6244f.firebaseapp.com",
  projectId: "favourami-6244f",
  storageBucket: "favourami-6244f.appspot.com",
  messagingSenderId: "932352124114",
  appId: "1:932352124114:web:506de01a71185ca156f90b"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //init Firestore
  const db = getFirestore(app);

  // Initialize Firebase Auth with AsyncStorage persistence
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  export { db, auth };
  
