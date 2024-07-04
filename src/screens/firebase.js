import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCqd0IztgL0bCgRrkqJ2gR3_uZWPrZt3Sg",
    authDomain: "aquaconnect-8ab98.firebaseapp.com",
    databaseURL: "https://aquaconnect-8ab98-default-rtdb.firebaseio.com",
    projectId: "aquaconnect-8ab98",
    storageBucket: "aquaconnect-8ab98.appspot.com",
    messagingSenderId: "662227223294",
    appId: "1:662227223294:web:bb04d6d926cfda4ff7dbaf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);  
const realtimeDB = getDatabase(app);

export { app, auth, firestore, realtimeDB  };