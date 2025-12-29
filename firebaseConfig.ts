import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJ5SiyLG-Iin2haJEOV-YXoWJHWfb_0t8",
    authDomain: "playchrono-b7d00.firebaseapp.com",
    projectId: "playchrono-b7d00",
    storageBucket: "playchrono-b7d00.firebasestorage.app",
    messagingSenderId: "14424728308",
    appId: "1:14424728308:web:8de0cba3d2f30ab7f574a1",
    measurementId: "G-FXN54RCJ17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
