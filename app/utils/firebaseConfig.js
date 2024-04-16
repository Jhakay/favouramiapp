import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import firestore from '@react-native-firebase/firestore'
import {getFirestore} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { collection, getDocs } from 'firebase/firestore';

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvdcacwS18hrQMuNZol3VFER1pqbMHDT4",
    authDomain: "favouramiapp-d0107.firebaseapp.com",
    projectId: "favouramiapp-d0107",
    storageBucket: "favouramiapp-d0107.appspot.com",
    messagingSenderId: "833711172427",
    appId: "1:833711172427:web:9da53100c6473712a816ce",
    measurementId: "G-5TDXXFDZHP"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
  
    //init Firestore
    const db = getFirestore(app);
    //const db = firestore(app);
  
    // Initialize Firebase Auth with AsyncStorage persistence
    const auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  
    export { db, auth };