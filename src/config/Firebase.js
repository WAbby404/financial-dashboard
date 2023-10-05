import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDud-V_BGbC24w-D5-pk5N1TlhtAtL8UHY',
  authDomain: 'financial-dashboard-17bd5.firebaseapp.com',
  projectId: 'financial-dashboard-17bd5',
  storageBucket: 'financial-dashboard-17bd5.appspot.com',
  messagingSenderId: '377490810497',
  appId: '1:377490810497:web:60267cba90fd1c122b0f80',
  measurementId: 'G-MSHXHXKXVN'
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();